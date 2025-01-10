import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Contributor {
  name: string;
  image: string;
  role: string;
  linkedin: string;
}

const contributors: Contributor[] = [
  {
    name: "Tushar Patil",
    image: "/tushar.jpg",
    role: "Lead Designer & AI",
    linkedin: "https://www.linkedin.com/in/tusharpatil02/"
  },
  {
    name: "Jayesh Gavale",
    image: "/jayesh.jpg",
    role: "Frontend Developer",
    linkedin: "https://www.linkedin.com/in/jayesh-gavale-1130b4232/"
  },
  {
    name: "Tejas Chaudhari",
    image: "/tejas.jpg",
    role: "Backend Developer",
    linkedin: "https://www.linkedin.com/in/tejas-chaudhari-792113230/"
  },
  {
    name: "Sagar Bhoi",
    image: "/sagar.jpg",
    role: "Full Stack Developer",
    linkedin: "https://www.linkedin.com/in/bhoi-sagar/"
  }
];

export const Contributors = () => {
  return (
    <div className="w-full bg-accent/50 py-8 px-4 rounded-lg backdrop-blur-sm">
      <h3 className="text-2xl font-semibold text-center mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Meet Our Contributors
      </h3>
      <div className="flex flex-wrap justify-center gap-6 items-center">
        {contributors.map((contributor) => (
          <div
            key={contributor.name}
            className="flex flex-col items-center group animate-fade-up"
          >
            <div className="relative">
              <Avatar className="h-32 w-32 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                <AvatarImage className="object-cover" src={contributor.image} alt={contributor.name} />
                <AvatarFallback>
                  <UserRound className="h-8 w-8 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute w-50 -bottom-1 left-1/2 -translate-x-1/2 bg-primary text-xs px-2 py-0.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {contributor.role}
              </div>
            </div>
            <p className="mt-4 font-medium text-sm">{contributor.name}</p>
            <a 
              href={contributor.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
            >
              <Linkedin className="h-4 w-4" style={{color : "blue"}} />
              <span className="text-xs" style={{color : "blue"}}>LinkedIn</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};