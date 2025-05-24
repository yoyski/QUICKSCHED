// src/components/LoadingScreen.jsx
import "./loading.css"; // Import custom animation styles (defined below)

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-yellow-400 rounded-full dot-pulse delay-0"></div>
        <div className="w-3 h-3 bg-red-400 rounded-full dot-pulse delay-1"></div>
        <div className="w-3 h-3 bg-blue-400 rounded-full dot-pulse delay-2"></div>
        <div className="w-3 h-3 bg-green-400 rounded-full dot-pulse delay-3"></div>
      </div>
    </div>
  );
}
