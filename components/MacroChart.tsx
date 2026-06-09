"use client";

import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import type { PolymarketSnapshot } from "@/lib/polymarket";

function drawBars(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  title: string,
  data: { label: string; probability: number }[],
  width: number,
  startY: number
) {
  const rowHeight = 18;
  const labelWidth = 72;
  const barMaxWidth = width - labelWidth - 44;
  const height = 28 + data.length * rowHeight;

  const group = svg
    .append("g")
    .attr("transform", `translate(0, ${startY})`);

  group
    .append("text")
    .attr("x", 0)
    .attr("y", 12)
    .attr("class", "chart-title")
    .text(title);

  const rows = group
    .selectAll("g.row")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "row")
    .attr("transform", (_, i) => `translate(0, ${24 + i * rowHeight})`);

  rows
    .append("text")
    .attr("x", 0)
    .attr("y", 12)
    .attr("class", "chart-label")
    .text((d) => d.label);

  rows
    .append("rect")
    .attr("x", labelWidth)
    .attr("y", 2)
    .attr("height", 12)
    .attr("width", 0)
    .attr("class", "chart-bar")
    .transition()
    .duration(500)
    .attr("width", (d) => Math.max((d.probability / 100) * barMaxWidth, d.probability > 0 ? 1 : 0));

  rows
    .append("text")
    .attr("x", width - 36)
    .attr("y", 12)
    .attr("class", "chart-value")
    .text((d) => (d.probability < 1 ? `${d.probability.toFixed(1)}%` : `${d.probability.toFixed(1)}%`));

  return height;
}

export default function MacroChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [snapshot, setSnapshot] = useState<PolymarketSnapshot | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/polymarket")
      .then((res) => res.json())
      .then((data) => setSnapshot(data))
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    if (!snapshot || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 420;
    const fedHeight = 28 + snapshot.fedJune.length * 18;
    const cpiHeight = 28 + snapshot.coreCpiMay.length * 18;
    const totalHeight = fedHeight + cpiHeight + 36;

    d3.select(containerRef.current).selectAll("svg").remove();

    const svg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", totalHeight)
      .attr("viewBox", `0 0 ${width} ${totalHeight}`)
      .attr("class", "macro-chart-svg");

    const fedBlock = drawBars(
      svg,
      "Fed Decision — June 17 (Polymarket Implied)",
      snapshot.fedJune,
      width,
      0
    );

    drawBars(
      svg,
      "Core CPI YoY — May 2026 (Polymarket Implied)",
      snapshot.coreCpiMay,
      width,
      fedBlock + 16
    );

    svg
      .append("text")
      .attr("x", 0)
      .attr("y", totalHeight - 4)
      .attr("class", "chart-source")
      .text(
        `Source: Polymarket · ${new Date(snapshot.fetchedAt).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })}`
      );
  }, [snapshot]);

  if (error) {
    return <div className="macro-chart macro-chart-error">Polymarket data unavailable</div>;
  }

  if (!snapshot) {
    return <div className="macro-chart macro-chart-loading">Loading Polymarket data…</div>;
  }

  return <div ref={containerRef} className="macro-chart" />;
}
