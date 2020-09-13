import turtle
from numpy import random

wn = turtle.Screen()
wn.title("Ping Pong")
wn.bgcolor('black')
wn.setup(width = 800, height = 600)
wn.tracer(0)

# variables
scores_1 = 0
scores_2 = 0

# Game Ai
class AI:
    def __init__(self):
        self.y = 0
    def where_to_move(self):
        ball_cor = [ball.xcor(), ball.ycor()]
        if(ball.dx > 0):
            self.y = (ball.dy/ball.dx)*(350 - ball_cor[0]) + ball_cor[1]
            if(self.y > 290):
                self.y = 580 - self.y
            elif(self.y < -290):
                self.y = -580 - self.y
    def move(self):
        self.where_to_move()
        if(self.y - paddle_2.ycor() > 35):
            paddle_2_up()
        elif (self.y - paddle_2.ycor() < -35):
            paddle_2_down()

# Some Basic functions
def ask_lose():
    a = turtle.textinput("You Lose!!", "Do you want to continue??(Answer in yes/no)")
    if(a.lower() == 'yes'):
        wn.listen()
        wn.onkeypress(paddle_1_up, "w")
        wn.onkeypress(paddle_1_down, "s")
        scores_1 = 0
        return False
    elif(a.lower() == 'no'):
        return True
    else:
        print('enter a valid argument')
        return True

def ask_win():
    a = turtle.textinput("You Win!!", "Do you want to continue??(Answer in yes/no)")
    if(a.lower() == 'yes'):
        wn.listen()
        wn.onkeypress(paddle_1_up, "w")
        wn.onkeypress(paddle_1_down, "s")
        scores_1 = 0
        return False
    elif(a.lower() == 'no'):
        return True
    else:
        print('enter a valid argument')
        return True

def ball_random_init():
    ball.goto(random.randint(-290, 290), random.randint(-290, 290))
    if (random.rand() > 0.5):
        ball.dx = 0.03
    else:
        ball.dx = -0.03
    if (random.rand() > 0.5):
        ball.dy = 0.03
    else:
        ball.dy = -0.03
def paddle_1_init():
    paddle_1.goto(-350, 0)

def paddle_2_init():
    paddle_2.goto(350, 0)

def paddle_1_up():
    y = paddle_1.ycor()
    y += 20
    paddle_1.sety(y)

def paddle_1_down():
    y = paddle_1.ycor()
    y -= 20
    paddle_1.sety(y)

def paddle_2_up():
    y = paddle_2.ycor()
    y += 0.04
    paddle_2.sety(y)

def paddle_2_down():
    y = paddle_2.ycor()
    y -= 0.04
    paddle_2.sety(y)

def speed_increase():
    if ball.dx > 0:
        ball.dx += 0.001
    elif ball.dx < 0:
        ball.dx -= 0.001
    if ball.dy > 0:
        ball.dy += 0.001
    elif ball.dy < 0:
        ball.dy -= 0.001

# Keyboard bindings
wn.listen()
wn.onkeypress(paddle_1_up, "w")
wn.onkeypress(paddle_1_down, "s")
#wn.onkeypress(paddle_2_up, "Up")
#wn.onkeypress(paddle_2_down, "Down")

# Paddle 1
paddle_1 = turtle.Turtle()
paddle_1.speed(0)
paddle_1.shape("square")
paddle_1.color('white')
paddle_1.shapesize(stretch_wid=5, stretch_len=1)
paddle_1.penup()
paddle_1_init()

# Paddle 2
paddle_2 = turtle.Turtle()
paddle_2.speed(0)
paddle_2.shape("square")
paddle_2.color('white')
paddle_2.shapesize(stretch_wid=5, stretch_len=1)
paddle_2.penup()
paddle_2_init()

# Ball
ball = turtle.Turtle()
ball.speed(0)
ball.shape("square")
ball.color('white')
ball.penup()
ball_random_init()

# Pen
pen = turtle.Turtle()
pen.speed(0)
pen.color("white")
pen.penup()
pen.hideturtle()
pen.goto(0, 260)
pen.write("Player Score : 0", align = 'center', font = ('Courier', 24, 'normal'))

# AI
opponent = AI()

# Main Game
ask = True
while ask:
    wn.update()

    # Ball movement
    ball.setx(ball.xcor() + ball.dx)
    ball.sety(ball.ycor() + ball.dy)

    # Border check
    if(ball.ycor() > 290):
        ball.sety(290)
        ball.dy *= -1
    if (ball.ycor() < -290):
        ball.sety(-290)
        ball.dy *= -1

    if(ball.xcor() > 390):
        ball_random_init()
        paddle_1_init()
        paddle_2_init()
        scores_1 += 1
        ball.dx *= -1
        if(ask_win()):
            break

    if (ball.xcor() < -390):
        ball_random_init()
        paddle_1_init()
        paddle_2_init()
        scores_2 += 1
        ball.dx *= -1
        if(ask_lose()):
            break

    if(paddle_1.ycor() > 250):
        paddle_1.sety(250)

    if (paddle_1.ycor() < -250):
        paddle_1.sety(-250)

    if (paddle_2.ycor() > 250):
        paddle_2.sety(250)

    if (paddle_2.ycor() < -250):
        paddle_2.sety(-250)

    # collision logic
    if (ball.xcor() > 340 and ball.xcor() < 350 and (ball.ycor() < paddle_2.ycor() + 40 and ball.ycor() > paddle_2.ycor()  - 40)):
        ball.setx(340)
        scores_2 += 1
        ball.dx *= -1
        speed_increase()

    if (ball.xcor() < -340 and ball.xcor() > -350 and (ball.ycor() < paddle_1.ycor() + 40 and ball.ycor() > paddle_1.ycor()  - 40)):
        ball.setx(-340)
        ball.dx *= -1
        scores_1 += 1
        speed_increase()
        pen.clear()
        pen.write("Player Score : {}".format(scores_1), align='center', font=('Courier', 24, 'normal'))

    opponent.move()
