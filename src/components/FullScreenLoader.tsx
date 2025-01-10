import { Loader } from "lucide-react";
import animation from "../../public/tea.gif"; // Replace with your JSON file path


interface FullScreenLoaderProps {
  isOpen: boolean;
}

export const FullScreenLoader = ({ isOpen }: FullScreenLoaderProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-orange-100/90 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-up">
      <div className="flex flex-col items-center gap-4">
      <div style={{ width: 300, height: 300 }}> {/* Adjust size as needed */}
      <img
        src={animation} // Replace with the correct path to your GIF
        alt="GIF Animation"
        style={{ width: "300px", height: "auto" }} // Adjust width and height as needed
      />
    </div>
        {/* <Loader className="h-12 w-12 animate-spin text-primary" /> */}
        <p className="text-lg font-medium text-foreground">Data Analyzing...</p>
      </div>
    </div>
  );
};