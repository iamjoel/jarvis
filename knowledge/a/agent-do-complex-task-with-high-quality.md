# Agent do Complex Task with High Quality
First, know what does high quality mean for the task. 

Then, split into some tasks into some phases with checkpoints to ensure the quality.

## Example
Coding the front-end for a complex page. Phases:
1. Design the data types. If the api is given, design the data types according to the api. If not, design the api first according to the requirements, then design the data types according to the api.
2. Create mock data according to the data types, or use the api to get real data.
3. Design the components according to the given screenshot. Prompt: `Design the names of components in the screenshot. Keep components with single responsibility. Output the result in a tree structure with component`.
4. Create that components files, and just put placeholder content in them.
5. Complete the components with figma url(Use figma MCP). If the UI is large, split the figma url into multiple parts, and complete the components part by part.
6. Add interactivity to the components.
