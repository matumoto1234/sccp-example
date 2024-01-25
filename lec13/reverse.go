package slice

func Reverse(a []int) []int {
	b := make([]int, len(a))
	copy(b, a)

	for i, j := 0, len(b)-1; i < j; i, j = i+1, j-1 {
		b[i], b[j] = b[j], b[i]
	}

	return b
}
