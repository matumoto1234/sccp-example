package slice

func filter(a []int, f func(int) bool) []int {
	b := make([]int, 0)

	for _, v := range a {
		if !f(v) {
			b = append(b, v)
		}
	}

	return b
}
