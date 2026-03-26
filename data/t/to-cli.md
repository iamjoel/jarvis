# Turn website into a CLI
Explore the API from the website, extract the API information to a instruction, so the LLM knows how and when to call it. CLI uses browser plugin to call the API, so it can use the cookie in the browser.

It's faster than using an AI browser, because it directly calls the API. The AI browser uses screenshots and OCR to get the information, which is slow and not stable.

The problem is that if the api of the website is changed, the CLI might break.

## Projects
- [OpenCLI](https://github.com/jackwener/opencli) A CLI tool that turns any website, Electron app(use browser), or local CLI tool into a command-line interface. Skill: [CLI-EXPLORER](https://github.com/jackwener/opencli/blob/main/CLI-EXPLORER.md) help to explore the API of a website and generate the instruction for the LLM.
- [bb-browser](https://github.com/epiral/bb-browser)
