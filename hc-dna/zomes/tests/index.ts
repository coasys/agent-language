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
    const [alice_conductor, bob_conductor] = await s.players([conductorConfig, conductorConfig])
    const [[alice]] = await alice_conductor.installAgentsHapps(installation)
    const [[bob]] = await bob_conductor.installAgentsHapps(installation)
    await s.shareAllNodes([alice_conductor, bob_conductor])
     
    await alice.cells[0].call("agent_store", "create_agent_expression",  
      {
        author: "did:key:zQ3shc5AcaZyRo6qP3wuXvYT8xtiyFFL25RjMEuT81WMHEibC",
        timestamp: new Date().toISOString(),
        data: {
          did: "did:key:zQ3shc5AcaZyRo6qP3wuXvYT8xtiyFFL25RjMEuT81WMHEibC",
          perspective: {
            links: [
              {
                author: "did:key:zQ3shc5AcaZyRo6qP3wuXvYT8xtiyFFL25RjMEuT81WMHEibC",
                timestamp: new Date().toISOString(),    
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
        },
        proof: {
          signature: "sig",
          key: "key",
          valid: true,
          invalid: false,
        },
      })
    
    let getResp = await alice.cells[0].call("agent_store", "get_agent_expression", "did:key:zQ3shc5AcaZyRo6qP3wuXvYT8xtiyFFL25RjMEuT81WMHEibC");
    t.ok(getResp);
    t.deepEqual(getResp.data.directMessageLanguage, "language://hashyHash");

    await alice.cells[0].call("agent_store", "create_agent_expression",  
    {
      author: "did:key:zQ3shc5AcaZyRo6qP3wuXvYT8xtiyFFL25RjMEuT81WMHEibC",
      timestamp: new Date().toISOString(),
      data: {
        did: "did:key:zQ3shc5AcaZyRo6qP3wuXvYT8xtiyFFL25RjMEuT81WMHEibC",
        perspective: {
          links: [
            {
              author: "did:key:zQ3shc5AcaZyRo6qP3wuXvYT8xtiyFFL25RjMEuT81WMHEibC",
              timestamp: new Date().toISOString(),    
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
      },
      proof: {
        signature: "sig",
        key: "key",
        valid: true,
        invalid: false,
      },
    })

    let getResp2 = await alice.cells[0].call("agent_store", "get_agent_expression", "did:key:zQ3shc5AcaZyRo6qP3wuXvYT8xtiyFFL25RjMEuT81WMHEibC");
    t.ok(getResp2);
    t.deepEqual(getResp2.data.directMessageLanguage, "language://hashyHash2");


    //====================
    await new Promise(r => setTimeout(r, 1000))
    //====================

    let bobResult = await bob.cells[0].call("agent_store", "get_agent_expression", "did:key:zQ3shc5AcaZyRo6qP3wuXvYT8xtiyFFL25RjMEuT81WMHEibC");
    t.ok(bobResult);
    t.deepEqual(bobResult.data.directMessageLanguage, "language://hashyHash2");
})

// Run all registered scenarios as a final step, and gather the report,
// if you set up a reporter
const report = orchestrator.run()

// Note: by default, there will be no report
console.log(report)