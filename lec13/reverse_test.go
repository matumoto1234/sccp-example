package slice

import "testing"

func TestReverse(t *testing.T) {
	// テストケースを用意
	tests := []struct {
		name string
		in   []int
		want []int
	}{
		{"空スライスを渡した場合、空スライスが返る", []int{}, []int{}},
		{"1要素の場合、同じスライスが返る", []int{10}, []int{10}},
		{"5要素の場合、逆順に返る", []int{1, 2, 3, 4, 5}, []int{5, 4, 3, 2, 1}},
	}

	// テストケースに対してテストを実行
	for _, test := range tests {
		test := test

		t.Run(test.name, func(t *testing.T) {
			got := Reverse(test.in)

			// reflect.DeepEqualを使ってもOK
			// なにをしているのか追いやすいようにsame()を自前で用意
			if !same(got, test.want) {
				t.Errorf("want %v, but %v:", test.want, got)
			}
		})
	}
}

// スライスの要素が同じかどうかを判定する
func same(a, b []int) bool {
	// nil check
	if a == nil && b == nil {
		return true
	} else if a == nil || b == nil {
		return false
	}

	// len check
	if len(a) != len(b) {
		return false
	}

	// value check
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}

	return true
}
