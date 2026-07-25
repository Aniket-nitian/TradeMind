from typing import TypedDict

from langgraph.graph import StateGraph, END

from app.tools.dashboard.get_overview import get_dashboard_overview
from app.tools.dashboard.get_equity_curve import get_equity_curve
from app.tools.dashboard.get_monthly_performance import get_monthly_performance
from app.tools.dashboard.get_drawdown import get_drawdown
from app.tools.dashboard.get_streaks import get_streaks


class PerformanceState(TypedDict):

    token: str

    overview: dict

    equity_curve: list

    monthly_performance: list

    drawdown: dict

    streaks: dict


async def overview_node(state: PerformanceState):

    state["overview"] = await get_dashboard_overview(
        state["token"]
    )

    return state


async def equity_curve_node(state: PerformanceState):

    state["equity_curve"] = await get_equity_curve(
        state["token"]
    )

    return state


async def monthly_performance_node(state: PerformanceState):

    state["monthly_performance"] = await get_monthly_performance(
        state["token"]
    )

    return state


async def drawdown_node(state: PerformanceState):

    state["drawdown"] = await get_drawdown(
        state["token"]
    )

    return state


async def streaks_node(state: PerformanceState):

    state["streaks"] = await get_streaks(
        state["token"]
    )

    return state


builder = StateGraph(PerformanceState)

builder.add_node("overview", overview_node)

builder.add_node("equity_curve", equity_curve_node)

builder.add_node("monthly_performance", monthly_performance_node)

builder.add_node("drawdown", drawdown_node)

builder.add_node("streaks", streaks_node)

builder.set_entry_point("overview")

builder.add_edge("overview", "equity_curve")

builder.add_edge("equity_curve", "monthly_performance")

builder.add_edge("monthly_performance", "drawdown")

builder.add_edge("drawdown", "streaks")

builder.add_edge("streaks", END)

performance_graph = builder.compile()
