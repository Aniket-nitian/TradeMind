from typing import TypedDict

from langgraph.graph import StateGraph, END

from app.tools.strategy.list_strategies import list_strategies
from app.tools.dashboard.get_strategy_analytics import get_strategy_analytics


class StrategyState(TypedDict):

    token: str

    strategies: list

    analytics: dict


async def strategies_node(state: StrategyState):

    state["strategies"] = await list_strategies(
        state["token"]
    )

    return state


async def analytics_node(state: StrategyState):

    state["analytics"] = await get_strategy_analytics(
        state["token"]
    )

    return state


builder = StateGraph(StrategyState)

builder.add_node("strategies", strategies_node)

builder.add_node("analytics", analytics_node)

builder.set_entry_point("strategies")

builder.add_edge("strategies", "analytics")

builder.add_edge("analytics", END)

strategy_graph = builder.compile()
