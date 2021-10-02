#include "stdio.h"

int check(int arr[], int l, int r, int x) {
	int mid;
	while (l <= r) {
		mid = (l + r) / 2;
		if (arr[mid] == x) 
			return 1;
		else {
			if (arr[mid] < x)
				l = mid + 1;
			else 
				r = mid - 1;
		}
	}
	return 0;
}

int main() {
	int num;
	int cnt = 10;
	int arr[] = {1,3,5,7,9,11,13,15,17,19};
	
	num = 6;
	if (check(arr, 0, cnt - 1, num)) printf("yes\n");
	else printf("no\n");

	num = 9;
	if (check(arr, 0, cnt - 1, num)) printf("yes\n");
	else printf("no\n");

	return 0;
}

/*
5
2 4 6 6 9
7

8
1 2 4 5 7 15 22 43
43
*/ 