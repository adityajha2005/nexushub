export const skillCategories = {
  programming: {
    label: "Programming Languages",
    skills: [
      "JavaScript",
      "TypeScript",
      "Python",
      "Java",
      "C++",
      "Ruby",
      "Go",
      "Rust",
      "Swift",
      "Kotlin",
      "PHP",
      "C#",
    ]
  },
  frontend: {
    label: "Frontend Development",
    skills: [
      "React",
      "Vue.js",
      "Angular",
      "Next.js",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "SASS/SCSS",
      "Redux",
      "WebGL",
      "Three.js",
      "Responsive Design",
    ]
  },
  backend: {
    label: "Backend Development",
    skills: [
      "Node.js",
      "Express.js",
      "Django",
      "Ruby on Rails",
      "Spring Boot",
      "FastAPI",
      "GraphQL",
      "REST APIs",
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "Redis",
    ]
  },
  cloud: {
    label: "Cloud & DevOps",
    skills: [
      "AWS",
      "Azure",
      "Google Cloud",
      "Docker",
      "Kubernetes",
      "CI/CD",
      "Jenkins",
      "Terraform",
      "Linux",
      "Networking",
      "Security",
      "Monitoring",
    ]
  },
  ai_ml: {
    label: "AI & Machine Learning",
    skills: [
      "Machine Learning",
      "Deep Learning",
      "TensorFlow",
      "PyTorch",
      "Computer Vision",
      "NLP",
      "Data Science",
      "Neural Networks",
      "Reinforcement Learning",
      "AI Ethics",
      "MLOps",
      "Statistics",
    ]
  },
  design: {
    label: "Design & UX",
    skills: [
      "UI Design",
      "UX Design",
      "Figma",
      "Adobe XD",
      "Sketch",
      "User Research",
      "Wireframing",
      "Prototyping",
      "Design Systems",
      "Accessibility",
      "Motion Design",
      "Visual Design",
    ]
  },
  soft_skills: {
    label: "Soft Skills",
    skills: [
      "Leadership",
      "Communication",
      "Project Management",
      "Agile",
      "Scrum",
      "Problem Solving",
      "Team Management",
      "Public Speaking",
      "Mentoring",
      "Time Management",
      "Conflict Resolution",
      "Critical Thinking",
    ]
  },
  mobile: {
    label: "Mobile Development",
    skills: [
      "iOS Development",
      "Android Development",
      "React Native",
      "Flutter",
      "SwiftUI",
      "Kotlin",
      "Mobile UI/UX",
      "App Store Optimization",
      "Mobile Security",
      "Cross-platform Development",
      "Mobile Testing",
      "Mobile Analytics",
    ]
  },
  blockchain: {
    label: "Blockchain & Web3",
    skills: [
      "Blockchain Development",
      "Smart Contracts",
      "Solidity",
      "Web3.js",
      "Ethereum",
      "DeFi",
      "NFTs",
      "Cryptocurrency",
      "dApps",
      "Consensus Mechanisms",
      "Tokenomics",
      "Blockchain Security",
    ]
  }
}

// Helper function to get all skills as a flat array
export const getAllSkills = () => {
  return Object.values(skillCategories).flatMap(category => category.skills)
}

// Helper function to get skill category label
export const getSkillCategory = (skill: string): string | null => {
  for (const [key, category] of Object.entries(skillCategories)) {
    if (category.skills.includes(skill)) {
      return category.label
    }
  }
  return null
} 