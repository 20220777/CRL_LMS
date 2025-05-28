import tensorflow as tf

(mnist_x, mnist_y), _ = tf.keras.datasets.mnist.load_data()
print(mnist_x.shape, mnist_y.shape)

(cifar_x, cifar_y), _ = tf.keras.datasets.cifar10.load_data()
print(cifar_x.shape, cifar_y.shape)

import matplotlib.pyplot as plt
plt.imshow(mnist_x[0], cmap='gray') #mnist의 0번째 이미지 출력

print(mnist_y[0:10])
#[5 0 4 1 9 2 1 3 1 4]
plt.imshow(mnist_x[1], cmap='gray')


print(cifar_y[0:10])
plt.imshow(cifar_x[0])

import numpy as np
d1 = np.array([1, 2, 3, 4, 5])
print(d1.shape)
d2 = np.array([d1, d1, d1, d1])
print(d2.shape)
d3 = np.array([d2, d2, d2])
print(d3.shape)
d4 = np.array([d3, d3])
print(d4.shape)

print(mnist_y.shape)
print(cifar_y.shape)

import pandas as pd

----------------------------------------------------------------------------------------

#데이터 준비
(독립, 종속), _ = tf.keras.datasets.mnist.load_data()
print(독립.shape, 종속.shape)

독립 = 독립.reshape(60000, 784)
종속 = pd.get_dummies(종속)
print(독립.shape, 종속.shape)

X = tf.keras.layers.Input(shape=[784])
H = tf.keras.layers.Dense(84, activation='swish')(X)
Y = tf.keras.layers.Dense(10, activation='softmax')(H)
model = tf.keras.models.Model(X, Y)
model.compile(loss='categorical_crossentropy', metrics=['accuracy'])

model.fit(독립, 종속, epochs=10)

#95% 정확도

#모델 이용
pred = model.predict(독립[0:5])
pd.DataFrame(pred).round(2)
Out[47]: 
     0    1    2    3    4    5    6    7    8    9
0  0.0  0.0  0.0  0.0  0.0  1.0  0.0  0.0  0.0  0.0
1  1.0  0.0  0.0  0.0  0.0  0.0  0.0  0.0  0.0  0.0
2  0.0  0.0  0.0  0.0  1.0  0.0  0.0  0.0  0.0  0.0
3  0.0  1.0  0.0  0.0  0.0  0.0  0.0  0.0  0.0  0.0
4  0.0  0.0  0.0  0.0  0.0  0.0  0.0  0.0  0.0  1.0


----------------------------------------------------------------------------------------

# flatten 레이어 사용 -> reshape 없이
#데이터 준비
(독립, 종속), _ = tf.keras.datasets.mnist.load_data()
print(독립.shape, 종속.shape)

#독립 = 독립.reshape(60000, 784)
종속 = pd.get_dummies(종속)
print(독립.shape, 종속.shape)
(60000, 28, 28) (60000,)
(60000, 28, 28) (60000, 10) ==> 펴진 상태가 아니라 이미지 상태 그대로


#모델 만들기
X = tf.keras.layers.Input(shape=[28, 28])
H = tf.keras.layers.Flatten()(X)
H = tf.keras.layers.Dense(84, activation='swish')(H)
Y = tf.keras.layers.Dense(10, activation='softmax')(H)
model = tf.keras.models.Model(X, Y)
model.compile(loss='categorical_crossentropy', metrics=['accuracy'])

model.fit(독립, 종속, epochs=5)


==> 이미지 데이터를 표 형태의 데이터로 바꿔서 표를 학습하는 모델 속에 넣고 학습을 시킨 것
**특징 자동 추출기


픽셀을 한 줄로 펴고 그 픽셀들로 새로운 특징 84개를 찾았고 다시 
10개의 분류로 만들었다.

------------------------------------------------------------------------------------------------
# 준비
(독립, 종속), _ = tf.keras.datasets.mnist.load_data()
print(독립.shape, 종속.shape)

독립 = 독립.reshape(60000, 28, 28, 1)
종속 = pd.get_dummies(종속)
print(독립.shape, 종속.shape)

(60000, 28, 28) (60000,)
(60000, 28, 28, 1) (60000, 10)

#모델 만들기
X = tf.keras.layers.Input(shape=[28, 28, 1])
H = tf.keras.layers.Conv2D(3, kernel_size=5, activation='swish')(X)
H = tf.keras.layers.Conv2D(6, kernel_size=5, activation='swish')(H)
H = tf.keras.layers.Flatten()(H)
H = tf.keras.layers.Dense(84, activation='swish')(H)
Y = tf.keras.layers.Dense(10, activation='softmax')(H)
model = tf.keras.models.Model(X, Y)
model.compile(loss='categorical_crossentropy', metrics=['accuracy'])

model.fit(독립, 종속, epochs=10)

#모델 이용
pred = model.predict(독립[0:5])
pd.DataFrame(pred).round(2)
Out[61]: 
     0    1    2    3    4    5    6    7    8    9
0  0.0  0.0  0.0  0.9  0.0  0.1  0.0  0.0  0.0  0.0
1  1.0  0.0  0.0  0.0  0.0  0.0  0.0  0.0  0.0  0.0
2  0.0  0.0  0.0  0.0  1.0  0.0  0.0  0.0  0.0  0.0
3  0.0  1.0  0.0  0.0  0.0  0.0  0.0  0.0  0.0  0.0
4  0.0  0.0  0.0  0.0  0.0  0.0  0.0  0.0  0.0  1.0

종속[0:5]

model.summary()
model.summary()
Model: "functional_6"
┌─────────────────────────────────┬────────────────────────┬───────────────┐
│ Layer (type)                    │ Output Shape           │       Param # │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ input_layer_9 (InputLayer)      │ (None, 28, 28, 1)      │             0 │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ conv2d_6 (Conv2D)               │ (None, 24, 24, 3)      │            78 │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ conv2d_7 (Conv2D)               │ (None, 20, 20, 6)      │           456 │ 특징맵
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ flatten_5 (Flatten)             │ (None, 2400)           │             0 │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ dense_18 (Dense)                │ (None, 84)             │       201,684 │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ dense_19 (Dense)                │ (None, 10)             │           850 │
└─────────────────────────────────┴────────────────────────┴───────────────┘
 Total params: 406,138 (1.55 MB) => 컴퓨터가 많은 학습을 했다.
 Trainable params: 203,068 (793.23 KB)
 Non-trainable params: 0 (0.00 B)
 Optimizer params: 203,070 (793.25 KB)

----------------------------------------------------------------------------------------

# 준비
(독립, 종속), _ = tf.keras.datasets.mnist.load_data()
print(독립.shape, 종속.shape)

독립 = 독립.reshape(60000, 28, 28, 1)
종속 = pd.get_dummies(종속)
print(독립.shape, 종속.shape)

(60000, 28, 28) (60000,)
(60000, 28, 28, 1) (60000, 10)

#모델 만들기
X = tf.keras.layers.Input(shape=[28, 28, 1])
H = tf.keras.layers.Conv2D(3, kernel_size=5, activation='swish')(X)
H = tf.keras.layers.MaxPool2D()(H)

H = tf.keras.layers.Conv2D(6, kernel_size=5, activation='swish')(H)
H = tf.keras.layers.MaxPool2D()(H)

H = tf.keras.layers.Flatten()(H)
H = tf.keras.layers.Dense(84, activation='swish')(H)
Y = tf.keras.layers.Dense(10, activation='softmax')(H)
model = tf.keras.models.Model(X, Y)
model.compile(loss='categorical_crossentropy', metrics=['accuracy'])


model.summary()
Model: "functional_7"
┌─────────────────────────────────┬────────────────────────┬───────────────┐
│ Layer (type)                    │ Output Shape           │       Param # │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ input_layer_10 (InputLayer)     │ (None, 28, 28, 1)      │             0 │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ conv2d_8 (Conv2D)               │ (None, 24, 24, 3)      │            78 │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ max_pooling2d (MaxPooling2D)    │ (None, 12, 12, 3)      │             0 │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ conv2d_9 (Conv2D)               │ (None, 8, 8, 6)        │           456 │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ max_pooling2d_1 (MaxPooling2D)  │ (None, 4, 4, 6)        │             0 │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ flatten_6 (Flatten)             │ (None, 96)             │             0 │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ dense_20 (Dense)                │ (None, 84)             │         8,148 │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ dense_21 (Dense)                │ (None, 10)             │           850 │
└─────────────────────────────────┴────────────────────────┴───────────────┘
 Total params: 9,532 (37.23 KB)
 Trainable params: 9,532 (37.23 KB)
 Non-trainable params: 0 (0.00 B)

model.fit(독립, 종속, epochs=10)

------------------------------------------------------------------------------------
LeNet실습 
Mnist


#데이터 준비
(독립, 종속), _ = tf.keras.datasets.mnist.load_data()
print(독립.shape, 종속.shape)

독립 = 독립.reshape(60000, 28, 28, 1)
종속 = pd.get_dummies(종속)
print(독립.shape, 종속.shape)

#모델 완성
X = tf.keras.layers.Input(shape=[28, 28, 1])

H = tf.keras.layers.Conv2D(6, kernel_size=5, padding='same', activation='swish')(X) #6장의 필터를 썼다
H = tf.keras.layers.MaxPool2D()(H)

H = tf.keras.layers.Conv2D(16, kernel_size=5, activation='swish')(H)
H = tf.keras.layers.MaxPool2D()(H)

H = tf.keras.layers.Flatten()(H)
H = tf.keras.layers.Dense(120, activation='swish')(H)
H = tf.keras.layers.Dense(84, activation='swish')(H)
Y = tf.keras.layers.Dense(10, activation='softmax')(H)

model = tf.keras.models.Model(X, Y)
model.compile(loss='categorical_crossentropy', metrics=['accuracy'])

model.fit(독립, 종속, epochs=10)


----------------------------------------------------------------------------------------
LeNet 실습 - cifar10

#데이터 준비
(독립, 종속), _ = tf.keras.datasets.cifar10.load_data()
print(독립.shape, 종속.shape)
#(50000, 32, 32, 3) (50000, 1)

종속 = pd.get_dummies(종속.reshape(50000))
print(독립.shape, 종속.shape)
#(50000, 32, 32, 3) (50000, 10)


#모델 완성
X = tf.keras.layers.Input(shape=[32, 32, 3])

H = tf.keras.layers.Conv2D(6, kernel_size=5, activation='swish')(X) #6장의 필터를 썼다
H = tf.keras.layers.MaxPool2D()(H)

H = tf.keras.layers.Conv2D(16, kernel_size=5, activation='swish')(H)
H = tf.keras.layers.MaxPool2D()(H)

H = tf.keras.layers.Flatten()(H)
H = tf.keras.layers.Dense(120, activation='swish')(H)
H = tf.keras.layers.Dense(84, activation='swish')(H)
Y = tf.keras.layers.Dense(10, activation='softmax')(H)

model = tf.keras.models.Model(X, Y)
model.compile(loss='categorical_crossentropy', metrics=['accuracy'])

model.fit(독립, 종속, epochs=10) #10번 학습

model.summary()

model.summary()
Model: "functional_9"
┌─────────────────────────────────┬────────────────────────┬───────────────┐
│ Layer (type)                    │ Output Shape           │       Param # │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ input_layer_12 (InputLayer)     │ (None, 32, 32, 3)      │             0 │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ conv2d_12 (Conv2D)              │ (None, 28, 28, 6)      │           456 │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ max_pooling2d_4 (MaxPooling2D)  │ (None, 14, 14, 6)      │             0 │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ conv2d_13 (Conv2D)              │ (None, 10, 10, 16)     │         2,416 │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ max_pooling2d_5 (MaxPooling2D)  │ (None, 5, 5, 16)       │             0 │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ flatten_8 (Flatten)             │ (None, 400)            │             0 │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ dense_25 (Dense)                │ (None, 120)            │        48,120 │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ dense_26 (Dense)                │ (None, 84)             │        10,164 │
├─────────────────────────────────┼────────────────────────┼───────────────┤
│ dense_27 (Dense)                │ (None, 10)             │           850 │
└─────────────────────────────────┴────────────────────────┴───────────────┘
 Total params: 124,014 (484.43 KB)
 Trainable params: 62,006 (242.21 KB)
 Non-trainable params: 0 (0.00 B)
 Optimizer params: 62,008 (242.22 KB)


---------------------------------------------------------------------------------

import glob
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

paths = glob.glob('C:/Users/lms48/OneDrive/바탕 화면/tensorflow/notMNIST_small/*/*.png')
paths = np.random.permutation(paths)
독립 = np.array([plt.imread(paths[i]) for i in range(len(paths))])
종속 = np.array([paths[i].split('/')[2] for i in range(len(paths))])
print(독립.shape, 종속.shape)





(18724, 28, 28) (18724, )









