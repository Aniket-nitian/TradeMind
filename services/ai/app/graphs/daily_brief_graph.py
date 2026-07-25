from datetime import datetime, timedelta, timezone
from typing import TypedDict

from langgraph.graph import StateGraph, END

from app.tools.dashboard.get_overview import get_dashboard_overview
from app.tools.dashboard.get_psychology import get_psychology
from app.tools.dashboard.get_confidence import get_confidence
from app.tools.dashboard.get_mistakes import get_mistakes
from app.tools.trade.get_recent_trades import get_recent_trades
from app.services.news_service import news_service

MARKET_NEWS_QUERIES = ["Nifty 50", "Sensex", "Indian stock market"]


class DailyBriefState(TypedDict):

    token: str

    overview: dict

    psychology: dict

    confidence: dict

    mistakes: dict

    recent_trades: list

    previous_day_trades: list

    market_news: list


async def overview_node(state: DailyBriefState):

    state["overview"] = await get_dashboard_overview(
        state["token"]
    )

    return state


async def psychology_node(state: DailyBriefState):

    state["psychology"] = await get_psychology(
        state["token"]
    )

    return state


async def confidence_node(state: DailyBriefState):

    state["confidence"] = await get_confidence(
        state["token"]
    )

    return state


async def mistakes_node(state: DailyBriefState):

    state["mistakes"] = await get_mistakes(
        state["token"]
    )

    return state


async def recent_trades_node(state: DailyBriefState):

    response = await get_recent_trades(
        state["token"]
    )

    trades = response.get("trades", [])

    state["recent_trades"] = trades

    yesterday = (
        datetime.now(timezone.utc) - timedelta(days=1)
    ).date()

    state["previous_day_trades"] = [
        trade
        for trade in trades
        if trade.get("entryTime")
        and datetime.fromisoformat(
            trade["entryTime"].replace("Z", "+00:00")
        ).date()
        == yesterday
    ]

    return state


async def market_news_node(state: DailyBriefState):

    state["market_news"] = await news_service.search(
        MARKET_NEWS_QUERIES,
        page_size=5,
    )

    return state


builder = StateGraph(DailyBriefState)

builder.add_node("overview", overview_node)

builder.add_node("psychology", psychology_node)

builder.add_node("confidence", confidence_node)

builder.add_node("mistakes", mistakes_node)

builder.add_node("recent_trades", recent_trades_node)

builder.add_node("market_news", market_news_node)

builder.set_entry_point("overview")

builder.add_edge("overview", "psychology")

builder.add_edge("psychology", "confidence")

builder.add_edge("confidence", "mistakes")

builder.add_edge("mistakes", "recent_trades")

builder.add_edge("recent_trades", "market_news")

builder.add_edge("market_news", END)

daily_brief_graph = builder.compile()