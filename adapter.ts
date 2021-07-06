import type { Address, Expression, PublicSharing, LanguageContext, HolochainLanguageDelegate, AgentAdapter, AgentExpression, AgentService } from "@perspect3vism/ad4m";
import { DNA_NICK } from "./dna";

export default class AgentAdapterImpl implements AgentAdapter {
  #DNA: HolochainLanguageDelegate;
  #agent: AgentService;

  constructor(context: LanguageContext) {
    this.#DNA = context.Holochain as HolochainLanguageDelegate;
    this.#agent = context.agent; 
  }

  async setProfile(agentExpression: AgentExpression) {
    const agentExpressionOrdered = Object.keys(agentExpression)
      .sort()
      .reduce((obj, key) => {
        obj[key] = agentExpression[key];
        return obj;
      }, {});
    const expression = this.#agent.createSignedExpression(agentExpressionOrdered);
    console.log("Posting agent expression", expression);
    await this.#DNA.call(
      DNA_NICK,
      "agent_store",
      "create_agent_expression",
      expression
    );
  };

  async getProfile(did: string): Promise<AgentExpression|void> {
    console.log("Getting expression with did", did);
    const expression = await this.#DNA.call(
      DNA_NICK,
      "agent_store",
      "get_agent_expression",
      did
    );

    return expression
  };
}
