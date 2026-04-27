 import { getReportModel } from "../config/geminiAI";


interface GenerateContentResponse{
  success: boolean
  content: string
}

export async function generateSectionContent(title: string, subject: string, promptContent: string, lastSection?: boolean, description?: string) : Promise<GenerateContentResponse> {
  try {
    console.log(`Generating content for: ${title}...`);
    const model = getReportModel(title);
    const result = await model.generateContent(`Topic: ${title} \nSubject: ${subject}\nDescription: ${description}\nPrompt:\n\n${promptContent}`);
    console.log(`Generated content for "${title}":`, result);
    const text = result.response.text();
    return {
      success: true,
      content: `${text}\n${lastSection?'':'---'}\n`
    };
  } catch (error) {
    console.error(`Error generating content for "${title}":`, error);
    return {
      success: false, 
      content: `## ${title}\n\nContent generation failed.\n\n`
    };
  }
}

// async function generateCompleteMDXContent(topic: string): Promise<string> {
//   const sections = [
//     { title: "Abstract", prompt: `Provide an abstract for the topic "${topic}" like the one given for a topic - Maze Solver using AI , below:
//     Maze solving is a classical problem in computer science and artificial intelligence, often used to demonstrate algorithmic problem-solving and pathfinding techniques. This report explores various algorithms used to solve mazes, with a focus on their effectiveness in finding the optimal path from a start to a goal position while avoiding obstacles. The report covers three major algorithms: Breadth-First Search (BFS), Depth-First Search (DFS), and A* search algorithm, each of which has distinct advantages and limitations. BFS is guaranteed to find the shortest path in an unweighted maze but is memory-intensive. DFS, while less resource-demanding, does not necessarily find the shortest path, as it explores paths deeply before backtracking. A* combines the efficiency of BFS with a heuristic that estimates the cost to reach the goal, optimizing both time and space complexity.
// The report includes a detailed analysis of the algorithms' performance, providing implementation examples, pseudocode, and visualizations of maze-solving processes. A comparison of time complexity, space complexity, and optimality is also presented, demonstrating the trade-offs between the algorithms. Finally, the report discusses practical applications of maze-solving algorithms in fields such as robotics, gaming, and puzzle-solving, and suggests areas for future research and improvements in algorithmic efficiency.
// Generate this kind of abstract for the topic "${topic}". Keep the title as "Abstract"` },
// { title: "Introduction", prompt: `Provide a comprehensive introduction to "${topic}". Keep the title as "Introduction"` },
// { title: `Importance of ${topic}`, prompt: `Discuss key benefits or impacts of "${topic}".` },
// { title:"Implementation", prompt: `Explain how to implement "${topic}" for college project.` },
// { title: "Key Applications", prompt: `Describe at least three applications of "${topic}".` },
//     { title: "Challenges", prompt: `Outline challenges associated with "${topic}".` },
//     { title: "Future Trends", prompt: `Discuss emerging trends related to "${topic}".` },
//     { title: "Conclusion", prompt: `Summarize the key points of "${topic}".` },
//     { title: "References", prompt: `List relevant references or resources for "${topic}". If providing specific URLs is beyond the scope of the response format, provide some books with author bullet list instead which are relevent to ${topic}. Dont mention that you cannot provide references or URLS. Keep the title as "References" ` },
//   ];

//   let completeContent = "";
//   for (const section of sections) {
//     completeContent += await generateSectionContent(section.title, section.prompt);
//   }
//   return completeContent;
// }

// export { generateCompleteMDXContent };