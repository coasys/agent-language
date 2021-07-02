import { Orchestrator, Config, InstallAgentsHapps } from '@holochain/tryorama'
import path from 'path'

const conductorConfig = Config.gen();

const installation: InstallAgentsHapps = [
  // agent 0
  [
    // happ 0
    [path.join("../../workdir/agent-store.dna")]
  ]
]

const orchestrator = new Orchestrator()

orchestrator.registerScenario("create update agent expression", async (s, t) => {
    const [alice] = await s.players([conductorConfig])
    const [[alice_sc_happ]] = await alice.installAgentsHapps(installation)
     
    await alice_sc_happ.cells[0].call("agent_store", "create_agent_expression",  
      {
        did: "did:key:zQ3shc5AcaZyRo6qP3wuXvYT8xtiyFFL25RjMEuT81WMHEibC",
        perspective: {
          links: [
            {
              author: "did:key:zQ3shc5AcaZyRo6qP3wuXvYT8xtiyFFL25RjMEuT81WMHEibC",
              timestamp: "ISO",    
              data: {
                source: "language://src",
                target: "language://target",
                predicate: "language://pred"
              },
              proof: {
                signature: "sig",
                key: "key",
                valid: true,
                invalid: false,
              },
            }
          ]
        },
        directMessageLanguage: "language://hashyHash"
      })
    
    let getResp = await alice_sc_happ.cells[0].call("agent_store", "get_agent_expression", "did:key:zQ3shc5AcaZyRo6qP3wuXvYT8xtiyFFL25RjMEuT81WMHEibC");
    t.ok(getResp);
    t.deepEqual(getResp.directMessageLanguage, "language://hashyHash");

    await alice_sc_happ.cells[0].call("agent_store", "create_agent_expression",  
    {
      did: "did:key:zQ3shc5AcaZyRo6qP3wuXvYT8xtiyFFL25RjMEuT81WMHEibC",
      perspective: {
        links: [
          {
            author: "did:key:zQ3shc5AcaZyRo6qP3wuXvYT8xtiyFFL25RjMEuT81WMHEibC",
            timestamp: "ISO",    
            data: {
              source: "language://src",
              target: "language://target",
              predicate: "language://pred"
            },
            proof: {
              signature: "sig",
              key: "key",
              valid: true,
              invalid: false,
            },
          }
        ]
      },
      directMessageLanguage: "language://hashyHash2"
    })

    let getResp2 = await alice_sc_happ.cells[0].call("agent_store", "get_agent_expression", "did:key:zQ3shc5AcaZyRo6qP3wuXvYT8xtiyFFL25RjMEuT81WMHEibC");
    t.ok(getResp2);
    t.deepEqual(getResp2.directMessageLanguage, "language://hashyHash2");
})

// Run all registered scenarios as a final step, and gather the report,
// if you set up a reporter
const report = orchestrator.run()

// Note: by default, there will be no report
console.log(report)