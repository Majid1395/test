#include <iostream>
#include "student.hpp"

using namespace std;

int main()
{
	Student s1(123456, "Max Mustermann");
	Student s2(654321, "Anna Musterfrau");
	cout << s1.getName() << endl;
	cout << s2.getMatrikelnr() << endl;

	return 0;
}
