from typing import TypedDict

from langgraph.graph import StateGraph, END

from app.tools.dashboard.get_psychology import get_psychology
from app.tools.dashboard.get_confidence import get_confidence
from app.tools.dashboard.get_mistakes import get_mistakes


class PsychologyState(TypedDict):

    token: str

    psychology: dict

    confidence: dict

    mistakes: dict


async def psychology_node(state: PsychologyState):

    state["psychology"] = await get_psychology(
        state["token"]
    )

    return state


async def confidence_node(state: PsychologyState):

    state["confidence"] = await get_confidence(
        state["token"]
    )

    return state


async def mistakes_node(state: PsychologyState):

    state["mistakes"] = await get_mistakes(
        state["token"]
    )

    return state


builder = StateGraph(PsychologyState)

builder.add_node("psychology", psychology_node)

builder.add_node("confidence", confidence_node)

builder.add_node("mistakes", mistakes_node)

builder.set_entry_point("psychology")

builder.add_edge("psychology", "confidence")

builder.add_edge("confidence", "mistakes")

builder.add_edge("mistakes", END)

psychology_graph = builder.compile()
