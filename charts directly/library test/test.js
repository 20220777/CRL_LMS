class LineChart {
	constructor(canvas, dataPoints, options = {}) {
		this.cvs = canvas;
		this.ctx = canvas.getContext("2d");
		this.dataPoints = dataPoints;

		this.options = {
			backgroundColor: options.backgroundColor || "#FFFFCC",
			lineColor: options.lineColor || "#0077cc",
			pointColor: options.pointColor || "#FF0000",
			axisColor: options.axisColor || "#000000",
			gradColor: options.gradColor || "#FF0000",
			font: options.font || "10px Arial",
			...options
		};

		this.orgX = 50;
		this.orgY = canvas.height - 50;
		this.chartWidth = canvas.width - this.orgX - 20;
		this.chartHeight = this.orgY - 20;

		this.tooltip = document.getElementById("tooltip");
		this.calculateScale();
		this.setupTooltip();
	}

	calculateScale() {
		const xs = this.dataPoints.map(p => p.x);
		const ys = this.dataPoints.map(p => p.y);

		this.minX = Math.min(...xs);
		this.maxX = Math.max(...xs);
		this.minY = Math.min(...ys);
		this.maxY = Math.max(...ys);

		if (this.maxX === this.minX) this.maxX += 1;
		if (this.maxY === this.minY) this.maxY += 1;
	}

	Ox(x) {
		return this.orgX + (x - this.minX) * (this.chartWidth / (this.maxX - this.minX));
	}
	Oy(y) {
		return this.orgY - (y - this.minY) * (this.chartHeight / (this.maxY - this.minY));
	}

	drawLine(x, y, w, h) {
		const ctx = this.ctx;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(w, h);
		ctx.stroke();
	}

	drawGrid() {
		const ctx = this.ctx;
		const cvs = this.cvs;
		const orgX = this.orgX;
		const orgY = this.orgY;

		ctx.fillStyle = this.options.backgroundColor;
		ctx.fillRect(0, 0, cvs.width, cvs.height);

		ctx.strokeStyle = this.options.axisColor;
		this.drawLine(orgX, orgY, orgX + this.chartWidth, orgY);
		this.drawLine(orgX, orgY, orgX, orgY - this.chartHeight);

		ctx.font = this.options.font;
		ctx.fillStyle = this.options.axisColor;

		const xTickCount = 30;
		for (let i = 0; i <= xTickCount; i++) {
			const xValue = this.minX + i * (this.maxX - this.minX) / xTickCount;
			const xPos = this.Ox(xValue);

			ctx.strokeStyle = this.options.gradColor;
			ctx.globalAlpha = 1;
			this.drawLine(xPos, orgY - 5, xPos, orgY + 5);
			ctx.fillText(xValue.toFixed(0), xPos - 10, orgY + 15);

			ctx.strokeStyle = this.options.axisColor;
			ctx.globalAlpha = 0.1;
			this.drawLine(xPos, orgY - 5, xPos, 20);
		}
		for (let i = 0; i <= 5 * xTickCount; i++) {
			const xxValue = this.minX + i * (this.maxX - this.minX) / (5 * xTickCount);
			const xxPos = this.Ox(xxValue);
			ctx.strokeStyle = this.options.axisColor;
			ctx.globalAlpha = 1;
			this.drawLine(xxPos, orgY - 3, xxPos, orgY + 3);
		}

		const yTickCount = 18;
		for (let i = 1; i <= yTickCount; i++) {
			const yValue = this.minY + i * (this.maxY - this.minY) / yTickCount;
			const yPos = this.Oy(yValue);

			ctx.strokeStyle = this.options.gradColor;
			ctx.globalAlpha = 1;
			this.drawLine(orgX - 5, yPos, orgX + 5, yPos);
			ctx.fillText(yValue.toFixed(0), orgX - 30, yPos + 3);

			ctx.strokeStyle = this.options.axisColor;
			ctx.globalAlpha = 0.1;
			this.drawLine(orgX, yPos, 700, yPos);
		}
		for (let i = 0; i <= 3 * xTickCount; i++) {
			const yyValue = this.minY + i * (this.maxY - this.minY) / (3 * xTickCount);
			const yyPos = this.Oy(yyValue);
			ctx.strokeStyle = this.options.axisColor;
			ctx.globalAlpha = 1;
			this.drawLine(orgX - 3, yyPos, orgX + 3, yyPos);
		}
	}

	drawChart() {
		const ctx = this.ctx;
		ctx.globalAlpha = 1;
		ctx.strokeStyle = this.options.lineColor;
		ctx.lineWidth = 1;
		ctx.beginPath();

		this.dataPoints.forEach((pt, i) => {
			const px = this.Ox(pt.x);
			const py = this.Oy(pt.y);
			if (i === 0) ctx.moveTo(px, py);
			else ctx.lineTo(px, py);
		});
		ctx.stroke();

		this.dataPoints.forEach(pt => {
			const px = this.Ox(pt.x);
			const py = this.Oy(pt.y);
			ctx.beginPath();
			ctx.arc(px, py, 3, 0, 2 * Math.PI);
			ctx.fillStyle = this.options.pointColor;
			ctx.fill();
		});
	}

	setupTooltip() {
		this.cvs.addEventListener("mousemove", (event) => {
			const rect = this.cvs.getBoundingClientRect();
			const mouseX = event.clientX - rect.left;
			const mouseY = event.clientY - rect.top;

			let closestPoint = null;
			let minDist = 8;

			this.dataPoints.forEach(pt => {
				const px = this.Ox(pt.x);
				const py = this.Oy(pt.y);
				const dist = Math.sqrt((px - mouseX) ** 2 + (py - mouseY) ** 2);
				if (dist < minDist) {
					closestPoint = pt;
					minDist = dist;
				}
			});

			if (closestPoint) {
				this.tooltip.style.left = event.pageX + 10 + "px";
				this.tooltip.style.top = event.pageY + 10 + "px";
				this.tooltip.innerHTML = `x: ${closestPoint.x}<br>y: ${closestPoint.y}`;
				this.tooltip.style.display = "block";
			} else {
				this.tooltip.style.display = "none";
			}
		});
	}

	draw() {
		this.drawGrid();
		this.drawChart();
	}
}

