"use client"

export default function NotAuthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-3xl font-display font-bold text-foreground">Access Denied</h1>
        <p className="text-muted-foreground">
          You do not have permission to view this page. Please log in with an account that has the correct role.
        </p>
        <a
          href="/login"
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 font-medium hover:bg-primary/90"
        >
          Go to Login
        </a>
      </div>
    </div>
  )
}

