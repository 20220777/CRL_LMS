int waterPins[] = {A0, A1, A2, A3, A4};  // 5개의 물 센서 핀
int numSensors = 5;  // 센서 개수

char msg[] = {'A', 'B', 'C', 'D', 'E'};

void setup() 
{
  Serial.begin(115200);  // 통신 속도 설정
  for (int i = 0; i < numSensors; i++) 
  {
    pinMode(waterPins[i], INPUT);
  }
}

void loop() 
{
  char highestSensor = 'X';  // 기본값을 'X'로 설정
  for (int i = 0; i < numSensors; i++) 
  {
    int value = analogRead(waterPins[i]);
    if (value > 700) 
    {  // 센서가 감지되면
      highestSensor = msg[i];  // 가장 높은 수위의 센서를 업데이트
    }
  }

  Serial.println(highestSensor);  // 메시지 전송
  delay(1000);  // 1초 간격으로 체크
}
