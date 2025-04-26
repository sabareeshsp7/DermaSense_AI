export interface ToastProps {
    title?: string
    description?: string
    variant?: "default" | "destructive"
    duration?: number
  }
  
  export function toast(props: ToastProps) {
    const { title } = props
    console.log(title); // Use the title variable
    // Implementation details handled by shadcn/ui
  }
  
  