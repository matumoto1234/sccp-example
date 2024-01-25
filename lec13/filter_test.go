package slice

import (
	"reflect"
	"testing"
)

func TestFilter(t *testing.T) {
	alwaysFalse := func(v int) bool {
		return false
	}
	alwaysTrue := func(v int) bool {
		return true
	}
	isEven := func(v int) bool {
		return v%2 == 0
	}

	tests := []struct {
		name string
		a    []int
		f    func(int) bool
		want []int
	}{
		{"空スライスを渡した場合、空スライスが返る",
			[]int{}, nil, []int{}},
		{"常にfalseを返す関数を渡した場合、引数と同じ要素のスライスが返る",
			[]int{1, 2, 3, 4, 5}, alwaysFalse, []int{1, 2, 3, 4, 5}},
		{"常にtrueを返す関数を渡した場合、引数と同じ要素のスライスが返る",
			[]int{1, 2, 3, 4, 5}, alwaysTrue, []int{}},
		{"すべての要素が偶数なスライスで偶数な要素をフィルターするした場合、空スライスが返る",
			[]int{0, 2, 4, 6, 8, 10}, isEven, []int{}},
		{"すべての要素が奇数なスライスで偶数な要素をフィルターするした場合、引数と同じ要素のスライスが返る",
			[]int{1, 3, 5, 7, 9}, isEven, []int{1, 3, 5, 7, 9}},
		{"偶数な要素をフィルターした場合、奇数な要素のみのスライスが返る",
			[]int{1, 2, 3, 4, 5}, isEven, []int{1, 3, 5}},
	}

	for _, test := range tests {
		test := test

		t.Run(test.name, func(t *testing.T) {
			got := filter(test.a, test.f)

			if !reflect.DeepEqual(got, test.want) {
				t.Errorf("want : %v, but : %v", test.want, got)
			}
		})
	}
}
