package slice

import "sort"

func Sort(a []int) []int {
	b := make([]int, len(a))
	copy(b, a)

	sort.Slice(b, func(i, j int) bool {
		return b[i] < b[j]
	})

	return b
}


