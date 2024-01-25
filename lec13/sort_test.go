package slice

import (
	"reflect"
	"testing"
)

func TestSort(t *testing.T) {
	tests := []struct {
		name string
		in   []int
		want []int
	}{
		{"空スライスを渡した場合、空スライスが返る",
			[]int{}, []int{}},
		{"1要素の場合、同じスライスが返る",
			[]int{10}, []int{10}},
		{"既にソート済みの場合、同じスライスに返る",
			[]int{1, 2, 3, 4, 5}, []int{1, 2, 3, 4, 5}},
		{"ソートされていない場合、昇順にソートされたスライスに返る",
			[]int{3, 1, 4, 1, 5, 9, 2}, []int{1, 1, 2, 3, 4, 5, 9}},
	}

	for _, test := range tests {
		test := test

		t.Run(test.name, func(t *testing.T) {
			got := Sort(test.in)

			if !reflect.DeepEqual(got, test.want) {
				t.Errorf("want : %v, but : %v", test.want, got)
			}
		})
	}
}
