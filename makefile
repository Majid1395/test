CFLAGS = -std=c++11 -Wall
PARTS = main student
OBJ = $(PARTS:%=%.o)

prog: $(OBJ)
	g++ $(CFLAGS) -o prog $(OBJ)

main.o: main.cpp
	g++ $(CFLAGS) -c main.cpp

%.o:	%.cpp %.hpp
	g++ $(CFLAGS) -c $<

clean:
	rm -f ./*.o ./prog
