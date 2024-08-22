// 2023-09-13
const isPrime = (x) => {
  for (let i = 2; i * i <= x; i++){
    if (x % i === 0) {
      return false
    }
  }
  return true
}

const findPrimes = function (n) {
  const a = []
  for (i = 2; i <= n; i++) {
    if (isPrime(i)) {
      a.push(i)
    }
  }
  return a
}

const SieveOfEratosthenes = (n) => {
  const a = new Array(n + 1).fill(true)
  for (let i = 2; i * i <= n; i++){
    for (let j = i; j <= n/ i; j++) {
      a[i * j] = false
    }
  }
  const b = []
  a.forEach((val, i) => {
    if (val) {
      b.push(i)
    }
  })

  return b
}

console.log(findPrimes(100))
console.log(SieveOfEratosthenes(100))


var countPrimes = function (n) {
  const isPrime = new Array(n).fill(true)
  let a = 0
  for (let i = 2; i < n; i++) {
      if (isPrime[i]) {
          a++
          for (let j = i * i; j < n; j += i) {
              isPrime[n] = false
          }
      }
  }

  return a
};

console.log(countPrimes(10))