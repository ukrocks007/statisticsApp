struct StatsStruct {
  1: double mean
  2: i32 median
  3: double variance
  4: double std_dev
}

service Calculator {

   bool ping(),

   list<i32> genRand(),

   StatsStruct calculateStats(1:list<i32> numbers)

}
