***IDX Multi-Agent Real Estate Assistant***

A multi-agent AI assistant built on OpenClaw that answers real estate questions over WhatsApp, backed by California MLS data. 

**Request lifecycle**

* Input: The user sends a WhatsApp message. The WhatsApp channel (linked to the gateway as a WhatsApp Web device) receives it.
* Access control: The channel checks the sender against channels.whatsapp.allowFrom. With dmPolicy: "allowlist", messages from unlisted numbers are ignored.
* Session routing: The gateway maps the sender to a session, so each user has their own conversation history.
* Reasoning: The gateway sends the message, session history, and available skills to the agent model. The model decides whether it can answer directly or needs a skill or tool.
* Tool execution: Skills run parameterized queries against MySQL and return structured results.
* Response: The model composes a reply, the session history is updated, and the gateway delivers the reply back through WhatsApp.


**Architecture Workflow**



**Components** 
* Gateway: long-running local process that hosts channels, sessions and agent runs. In this project it runs locally as a background service. (openclaw gateway start/stop/status)
* Channels: How the user communicates with OpenClaw. In this project, the main channel is Whatsapp. ()
* Sessions: Keeps track of user's conversation and state. ()
* Agent model: LLM that reads the conversation and decides what to do. In this case it's Claude. 
* Skill: handles specific tasks the model can call for (instructions + the code to do the work).
* Memory: Store info that OpenClaw might need when handling conversations. 
* Orchestration: Deciding which capability handles a request. 

**Data**
Two tables that live in a local MySQL database:
1. rets_property: active California MLS listings
2. california_sold: sold/closed transactions 