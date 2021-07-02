import type { Address, Agent, Expression, ExpressionAdapter, PublicSharing, LanguageContext, HolochainLanguageDelegate, AgentService } from "@perspect3vism/ad4m";
import { DNA_NICK } from "./dna";

class ProfilePutAdapter implements PublicSharing {
  #DNA: HolochainLanguageDelegate;

  constructor(context: LanguageContext) {
    this.#DNA = context.Holochain as HolochainLanguageDelegate;
  }

  async createPublic(agentExpression: object): Promise<Address> {
    const orderedShortFormData = Object.keys(agentExpression)
      .sort()
      .reduce((obj, key) => {
        obj[key] = agentExpression[key];
        return obj;
      }, {});
    //const expression = this.#agent.createSignedExpression(orderedShortFormData);
    console.log("Posting agent expression", orderedShortFormData);
    await this.#DNA.call(
      DNA_NICK,
      "agent_store",
      "create_agent_expression",
      orderedShortFormData
    );
    //@ts-ignore
    return orderedShortFormData.did;
  }
}

export default class ProfileAdapter implements ExpressionAdapter {
  #DNA: HolochainLanguageDelegate;

  putAdapter: PublicSharing;

  constructor(context: LanguageContext) {
    this.#DNA = context.Holochain as HolochainLanguageDelegate;
    this.putAdapter = new ProfilePutAdapter(context);
  }

  async get(address: Address): Promise<void | Expression> {
    console.log("Getting expression with address", address);
    const expression = await this.#DNA.call(
      DNA_NICK,
      "agent_store",
      "get_agent_expression",
      address
    );

    return expression
  }
}
