import { SupabaseClient } from '@supabase/supabase-js'
import { generateProjectDetails, generateFileContents, generateZipFile } from '@/lib/services/ai-service'

export class Webhook {
  /**
   * Handle new project creation
   * This triggers the AI generation process for the project
   */
  static async handleProjectCreation(
    supabase: SupabaseClient,
    project: any
  ) {
    try {
      // Update status to generating
      await supabase
        .from('projects')
        .update({ status: 'generating' })
        .eq('id', project.id)
      
      // Generate project details asynchronously
      const projectDetails = await generateProjectDetails(project.prompt)
      
      // Update project with details
      await supabase
        .from('projects')
        .update({
          name: projectDetails.name,
          description: projectDetails.description,
          tech_stack: projectDetails.techStack,
          structure: projectDetails.structure,
          status: 'completed',
          download_url: `/api/projects/${project.id}/download`
        })
        .eq('id', project.id)
      
      // Log successful generation
      await supabase.rpc('add_audit_log', {
        p_user_id: project.user_id,
        p_action: 'generate',
        p_entity_type: 'project',
        p_entity_id: project.id,
        p_details: { success: true },
        p_ip_address: null
      })
      
      // Trigger a notification to the user
      await sendNotification(supabase, project.user_id, {
        type: 'project_completed',
        title: 'Project Generated Successfully',
        message: `Your project "${projectDetails.name}" has been successfully generated and is ready for download.`,
        linkUrl: `/projects?id=${project.id}`
      })
    } catch (error) {
      console.error('Error generating project:', error)
      
      // Update project as failed
      await supabase
        .from('projects')
        .update({
          status: 'failed',
          tech_stack: { error: 'Failed to generate project details' }
        })
        .eq('id', project.id)
      
      // Log failed generation
      await supabase.rpc('add_audit_log', {
        p_user_id: project.user_id,
        p_action: 'generate',
        p_entity_type: 'project',
        p_entity_id: project.id,
        p_details: { success: false, error: (error as Error).message },
        p_ip_address: null
      })
      
      // Send failure notification
      await sendNotification(supabase, project.user_id, {
        type: 'project_failed',
        title: 'Project Generation Failed',
        message: 'There was an error generating your project. Please try again or contact support if the issue persists.',
        linkUrl: `/build?projectId=${project.id}`
      })
    }
  }
  
  /**
   * Handle project status changes
   */
  static async handleProjectStatusChange(
    supabase: SupabaseClient,
    project: any,
    oldProject: any
  ) {
    const { status, id, user_id } = project
    
    // Generate ZIP file when status changes to completed
    if (status === 'completed' && oldProject.status !== 'completed') {
      try {
        // Generate project details
        const projectDetails = {
          name: project.name,
          description: project.description,
          techStack: project.tech_stack
        }
        
        // Generate mock files based on project details
        const mockFiles = [
          {
            path: 'README.md',
            content: `# ${project.name}\n\n${project.description}\n\n## Tech Stack\n\n${JSON.stringify(project.tech_stack, null, 2)}`
          }
        ]
        
        // Generate ZIP file
        const zipUrl = await generateZipFile(projectDetails.name, mockFiles)
        
        // Update project with real download URL if needed
        if (zipUrl) {
          await supabase
            .from('projects')
            .update({ download_url: zipUrl })
            .eq('id', id)
        }
      } catch (error) {
        console.error('Error generating ZIP file:', error)
      }
    }
  }
  
  /**
   * Handle new user profile creation
   */
  static async handleProfileCreation(
    supabase: SupabaseClient,
    profile: any
  ) {
    try {
      // Send welcome notification
      await sendNotification(supabase, profile.id, {
        type: 'welcome',
        title: 'Welcome to OptimusCode.io!',
        message: 'Get started by creating your first project. Just describe what you want to build, and we\'ll generate the code!',
        linkUrl: '/build'
      })
      
      // Log profile creation
      await supabase.rpc('add_audit_log', {
        p_user_id: profile.id,
        p_action: 'create',
        p_entity_type: 'profile',
        p_entity_id: profile.id,
        p_details: {},
        p_ip_address: null
      })
    } catch (error) {
      console.error('Error handling profile creation:', error)
    }
  }
  
  /**
   * Handle subscription tier changes
   */
  static async handleSubscriptionChange(
    supabase: SupabaseClient,
    profile: any,
    oldProfile: any
  ) {
    try {
      const { id, subscription_tier } = profile
      const oldTier = oldProfile.subscription_tier || 'free'
      
      // Detect upgrade
      if (
        (oldTier === 'free' && ['pro', 'enterprise'].includes(subscription_tier)) ||
        (oldTier === 'pro' && subscription_tier === 'enterprise')
      ) {
        // Send upgrade notification
        await sendNotification(supabase, id, {
          type: 'subscription_upgraded',
          title: `Upgraded to ${subscription_tier.charAt(0).toUpperCase()}${subscription_tier.slice(1)}`,
          message: `Thank you for upgrading to the ${subscription_tier} tier! You now have access to additional features and higher generation limits.`,
          linkUrl: '/build'
        })
      }
      
      // Log subscription change
      await supabase.rpc('add_audit_log', {
        p_user_id: id,
        p_action: 'update',
        p_entity_type: 'subscription',
        p_entity_id: id,
        p_details: {
          old_tier: oldTier,
          new_tier: subscription_tier
        },
        p_ip_address: null
      })
    } catch (error) {
      console.error('Error handling subscription change:', error)
    }
  }
}

/**
 * Send a notification to a user
 * This is a placeholder function - in a real app, this would push to a
 * notifications table and potentially trigger real-time updates or emails
 */
async function sendNotification(
  supabase: SupabaseClient,
  userId: string,
  notification: {
    type: string
    title: string
    message: string
    linkUrl?: string
  }
) {
  try {
    // In a real implementation, this would insert into a notifications table
    // and potentially trigger a real-time update through Supabase's realtime features
    console.log(`Sending notification to user ${userId}: ${notification.title}`)
    
    // Simulate storing a notification (implement this table in production)
    // await supabase
    //   .from('notifications')
    //   .insert({
    //     user_id: userId,
    //     type: notification.type,
    //     title: notification.title,
    //     message: notification.message,
    //     link_url: notification.linkUrl,
    //     read: false
    //   })
    
    return true
  } catch (error) {
    console.error('Error sending notification:', error)
    return false
  }
}
