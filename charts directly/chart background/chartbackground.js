$(document).ready(function($) {
	/// main();
	canvas();
});

var cvs;
var ctx;

function Ox(x)
{
	return x;
}
function Oy(y)
{
	return cvs.height - y;
}

function drawLine(x,y,w,h)
{
	ctx.beginPath();
	ctx.moveTo( Ox(x), Oy(y) );
	ctx.lineTo( Ox(w), Oy(h) );
	ctx.stroke();
}

function canvas()
{
	cvs = document.getElementById("canvas");
	ctx = cvs.getContext("2d");
	
	ctx.fillStyle = "#AAAAAA";
	ctx.fillRect (0, 0, cvs.width, cvs.height);

	drawLine(50, 20, 700, 20);  //x축	
	drawLine(50, 20, 50,  470); //y축
		
	//x축 눈금	
	for (let i = 0; i < 130; i++) 
	{ 
		let x = 5 * i + 50;
		
		ctx.globalAlpha = 1;
		ctx.strokeStyle = "#000000"; // 일반 눈금
		drawLine(x, 17, x, 23); 
		
		if (i % 5 === 0) 
		{   
			ctx.globalAlpha = 1;
			ctx.strokeStyle = "#FF0000"; // 빨간 눈금
			drawLine(x + 25, 16, x + 25, 24);
			
			ctx.strokeStyle = "#000000"; // 실선
			ctx.globalAlpha = 0.1;
			drawLine(x + 25, 24, x + 24, 470);
			
			ctx.globalAlpha = 1; // 눈금 숫자
			ctx.fillStyle = "#000000";
			ctx.font = "10px Arial";
			ctx.fillText(`${i}`, x-5, 475);
		}
	}	
		
	// y축 눈금	
	for (let i = 0; i < 90; i++) 
	{
		let y = 5 * i + 20;
		
		ctx.globalAlpha = 1;
		ctx.strokeStyle = "#000000"; // 일반 눈금
		drawLine(47, y, 53, y); 

		if (i % 5 === 0) 
		{   
			ctx.globalAlpha = 1;
			ctx.strokeStyle = "#FF0000"; //빨간 눈금
			drawLine(46, y + 25, 54, y + 25);
			
			ctx.strokeStyle = "#000000"; //실선
			ctx.globalAlpha = 0.1;
			drawLine(54, y + 25, 700, y + 25);
			
			ctx.globalAlpha = 1; // 눈금 숫자
			ctx.fillStyle = "#000000";
			ctx.font = "10px Arial";
			ctx.fillText(`${i + 5}`, 33, Oy(y + 25) + 4);
		}
	}	
}


	


	
	
	

