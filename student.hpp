#ifndef STUDENT_HPP
#define STUDENT_HPP

#include <string>

class Student
{
	private:
		int matrikelnr;
		std::string name;

	public:
		Student(int m=0, std::string n="n.n.");

		int getMatrikelnr() const;
		std::string getName() const;
		void setMatrikelnr(int m);
		void setName(std::string n);
};

#endif
