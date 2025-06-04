interface LoaderProps {
    label?: string;
}

export default function Loader({ label }: LoaderProps) {
  return (
    <div className="text-center w-full h-full flex flex-col items-center justify-center">
        <div className="w-16 h-16 animate-pulse">
          <img
            src="/logo.png" // Replace with your actual logo path
            alt="Logo"
          />
          <p className="mt-2 text-sm text-muted-foreground">
          {label ? label : 'Loading...'}
          </p>
        </div>
    </div>
  );
}
