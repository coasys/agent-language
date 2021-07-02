use chrono::{DateTime, Utc};
use hdk::prelude::*;

#[hdk_extern]
fn entry_defs(_: ()) -> ExternResult<EntryDefsCallbackResult> {
    Ok(vec![Path::entry_def(), LinkExpression::entry_def(), AgentReference::entry_def()].into())
}

#[hdk_extern]
fn init(_: ()) -> ExternResult<InitCallbackResult> {
    Ok(InitCallbackResult::Pass)
}
