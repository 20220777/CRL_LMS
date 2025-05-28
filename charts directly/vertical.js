class LineChart
{
	constructor(canvas, dataPoints, options = {})
	{
		this.cvs = canvas;
		this.ctx = canvas.getContext("2d");
		this.dataPoints = dataPoints;
		
		// 옵션 처리 (기본값)
		this.options = 
		{
			backgroundColor: options.backgroundColor ||	"#FFFFCC",  //배경색
			lineColor: options.lineColor || "#0077cc",  //그래프 라인
			pointColor: options.pointColor || "#FF0000",  //dot
			axisColor: options.axisColor || "#000000",  //x,y축, 작은 눈금, 보조선
			gradColor: options.gradColor || "#FF0000", // 큰 눈금
			font: options.font || "10px Arial",
			...options
		};
		
		// 1사분면 기준 원점 잡기
		this.orgX = 50;
		this.orgY = canvas.height - 50;
		this.chartWidth = canvas.width - this.orgX - 20;
		this.chartHeight = this.orgY - 20;
		
		// 스케일 측정함수
		this.calculateScale();
		
		// 마우스오버
		this.tooltip = document.getElementById("tooltip");
		this.setupTooltip();
	}

	/////////////////////////////////////////////////////////////////////////////////
	///////////////////////    데이터 스케일 측정 함수    //////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////
	calculateScale()
	{
		const xs = this.dataPoints.map(p => p.x);
		const ys = this.dataPoints.map(p => p.y);
		
		this.minX = Math.min(...xs);
		this.maxX = Math.max(...xs);
		this.minY = Math.min(...ys);
		this.maxY = Math.max(...ys);
		
		// 데이터 범위가 0인 경우 방지하기
		if (this.maxX === this.minY) this.maxX += 1;
		if (this.maxY === this.minY) this.maxY += 1;
	}	



	Ox(x) { return this.orgX + (x - this.minX) * (this.chartWidth / (this.maxX - this.minX));}
	Oy(y) { return this.orgY - (y - this.minY) * (this.chartHeight / (this.maxY - this.minY));}
	//1사분면을 표현하기 위해 y값을 반전시켜줌
	

	//직선을 그리는 공통 함수 (Helper Method)
	drawLine(x,y,w,h)
	{
		const ctx = this.ctx;
		ctx.beginPath();
		ctx.moveTo( x, y );
		ctx.lineTo( w, h );
		ctx.stroke();
	}

	//////////////////////////////////////////////////////////////////////////////////
	////////  x축 y축, 1단위 눈금, 5단위 눈금, 숫자 등 그래프의 기본틀을 그리는 함수  ////////
	//////////////////////////////////////////////////////////////////////////////////
	drawGrid() 
	{
		const ctx = this.ctx;
		const cvs = this.cvs;
		const orgX = this.orgX;
		const orgY = this.orgY;
		
		//html에서 배경색 바꾸는 기능을 넣기 위한
		ctx.fillStyle = this.options.backgroundColor;
		ctx.fillRect (0, 0, cvs.width, cvs.height);

		ctx.strokeStyle = this.options.axisColor;
		this.drawLine(orgX, orgY, orgX + this.chartWidth, orgY);  //x축	
		this.drawLine(orgX, orgY, orgX,  orgY - this.chartHeight); //y축
			
		ctx.font = this.options.font;
		ctx.fillStyle = this.options.axisColor;
		
		//x축 눈금 + 보조선 + 숫자	
		const xTickCount = 30; // 눈금의 개수 설정
		for (let i = 0; i <= xTickCount; i++) 
		{		
			const xValue = this.minX + i * (this.maxX - this.minX) / xTickCount;
			// i번째 눈금의 실제 x값을 계산 = 실제 데이터상의 x값 의미
			const xPos = this.Ox(xValue);
			// xValue(실제 x값)이 canvas 상에서 몇 픽셀에 위치할지 계산
			
			ctx.strokeStyle = this.options.gradColor; // x축 큰 눈금
			ctx.globalAlpha = 1;
			this.drawLine(xPos, orgY - 5, xPos, orgY + 5);
			ctx.fillText(xValue.toFixed(0), xPos - 10, orgY + 15); // 숫자

			ctx.strokeStyle = this.options.axisColor; // x축 보조선
			ctx.globalAlpha = 0.1;
			this.drawLine(xPos, orgY -5, xPos, 20);
		}	
		for (let i = 0; i <= 5 * xTickCount; i++)
		{
			const xxValue = this.minX + i * (this.maxX - this.minX) / ( 5 * xTickCount );
			const xxPos = this.Ox(xxValue);
			
			ctx.strokeStyle = this.options.axisColor; // x축 작은 눈금
			ctx.globalAlpha = 1;
			this.drawLine(xxPos, orgY - 3, xxPos, orgY + 3);	
		}
			
		// y축 눈금 + 보조선 + 숫자
		const yTickCount = 18;
		for (let i = 1; i <= yTickCount; i++) // x축 눈금과 0 이 중복되기 때문에 i는 1부터
		{
			const yValue = this.minY + i * (this.maxY - this.minY) / yTickCount;
			const yPos = this.Oy(yValue);
			
			ctx.strokeStyle = this.options.gradColor; // y축 큰 눈금
			ctx.globalAlpha = 1;
			this.drawLine(orgX - 5, yPos, orgX + 5, yPos); 
			ctx.fillText(yValue.toFixed(0), orgX - 30, yPos + 3); // 숫자
			
			ctx.strokeStyle = this.options.axisColor; // y축 보조선
			ctx.globalAlpha = 0.1;
			this.drawLine(orgX, yPos, 700, yPos);
		}
		for (let i = 0; i <= 3 * xTickCount; i++)
		{
			const yyValue = this.minY + i * (this.maxY - this.minY) / ( 3 * xTickCount ) ;
			const yyPos = this.Oy(yyValue);
			
			ctx.strokeStyle = this.options.axisColor; // y축 작은 눈금
			ctx.globalAlpha = 1;
			this.drawLine(orgX - 3, yyPos, orgX + 3, yyPos);	
		}
		
	}	
		
	///////////////////////////////////////////////////////////////////////////////	
	///////////////////////////  라인차트 그리는 본체	///////////////////////////////
	///////////////////////////////////////////////////////////////////////////////
	drawChart() 
	{
		const ctx = this.ctx;
		ctx.globalAlpha = 1;
		ctx.strokeStyle = this.options.lineColor;
		ctx.lineWidth = 1;
		ctx.beginPath();

		// 찍힌 점을 잇는 라인 그래프 그리기
		this.dataPoints.forEach((pt, i) =>
		{
			// 데이터상의 좌표를 canvas의 좌표로 변환 (점 찍을 위치 계산)
			const px = this.Ox(pt.x);
			const py = this.Oy(pt.y);

			if (i === 0) {
				ctx.moveTo(px, py);
			} else {
				ctx.lineTo(px, py);
			}
		});
		ctx.stroke();
		

		// 각 점을 빨간 점으로 표시
		this.dataPoints.forEach (pt=>
		{
			const px = this.Ox(pt.x);
			const py = this.Oy(pt.y);
			ctx.beginPath();
			ctx.arc(px, py, 3, 0, 2 * Math.PI);
			ctx.fillStyle = this.options.pointColor;
			ctx.fill();
		});
	}
	
	///////////////////////////////////////////////////////////////////////////////////
	//////////////////////////// 마우스오버 툴팁 (각 점의 정보 표시) ///////////////////////
	///////////////////////////////////////////////////////////////////////////////////
	setupTooltip()
	{
		// 마우스 움직일 때마다 지정된 함수 호출 "mousemove", 등록
		this.cvs.addEventListener("mousemove", (event) =>
		{
			// 캔버스 화면에서 위치, 크기 가져오기 (마우스 좌표와 비교하기 위해) 
			const rect = this.cvs.getBoundingClientRect();
			// 그래프에 맞게 마우스 좌표를 조정해줌
			const mouseX = event.clientX - rect.left;
			const mouseY = event.clientY - rect.top;
			
			let closestPoint = null; // 현재 마우스와 가장 가까운 점 저장
			let minDist = 8; // 마우스가 8거리 안에 있으면 툴팁 띄우는 기준
			
			this.dataPoints.forEach(pt => {
				const px = this.Ox(pt.x);
				const py = this.Oy(pt.y);
				
				// 마우스 점 사이 유클리디안 거리 계산
				const dist = Math.sqrt((px - mouseX) ** 2 + (py - mouseY) ** 2);
				if (dist < minDist)
				{
					closestPoint = pt;
					minDist = dist;
				}
			});
			
			if (closestPoint)
			{
				this.tooltip.style.left = event.pageX + 20 + "px";
				this.tooltip.style.top = event.pageY + 20 + "px";
				this.tooltip.innerHTML = `x: ${closestPoint.x}<br>y: ${closestPoint.y}`;
				this.tooltip.style.display = "block";
			}
			else //가까운 점이 없으면 툴팁을 숨기기
			{
				this.tooltip.style.display = "none";
			}
		});
	}
	
	draw()
	{
		this.drawGrid();  //그래프 기본 틀
		this.drawChart(); //라인차트
	}
}			