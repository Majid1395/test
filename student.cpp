#include "student.hpp"

using namespace std;

Student::Student(int m, string n) : matrikelnr(m), name(n) {}

int Student::getMatrikelnr() const {
	return matrikelnr;
}

string Student::getName() const {
	return name;
}

void Student::setMatrikelnr(int m) {
	matrikelnr = m;
}

void Student::setName(string n) {
	name = n;
}
