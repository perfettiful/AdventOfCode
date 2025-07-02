
# Time: O(N)
# Space: O(log(N))

import hashlib
import time

secret_key = 'ckczppom'

example = 'abcdef609043'

def get_md5_hash(k: str) -> str:

    md5_hash = hashlib.md5()
    md5_hash.update(k.encode('utf-8'))
    hex = md5_hash.hexdigest()

    return hex

def starts_with_five_zeros(s: str) -> bool:
    return s.startswith('00000')

def starts_with_six_zeros(s: str) -> bool:
    return s.startswith('000000')

def starts_with_n_zeros(s: str, n: int) -> bool:
    return s.startswith('0'*n)

def mine_coin(secret_key: str) -> int:
    
    num = 1
    new_key = secret_key + str(num)
    hash = get_md5_hash(new_key)
    while not starts_with_five_zeros(hash):
        num += 1
        new_key = secret_key + str(num)
        hash = get_md5_hash(new_key)

    return num

assert mine_coin('abcdef') == 609043
assert mine_coin('pqrstuv') == 1048970

# print(mine_coin(secret_key))
    
def mine_coin2(secret_key: str) -> int:
    
    num = 1
    new_key = secret_key + str(num)
    hash = get_md5_hash(new_key)
    while not starts_with_n_zeros(hash, 6):
        num += 1
        new_key = secret_key + str(num)
        hash = get_md5_hash(new_key)

    return num

# print(mine_coin2(secret_key))

def mine_coin3(secret_key: str, num_leading_zeros: int) -> tuple[int, str]:
    
    num = 1
    new_key = secret_key + str(num)
    hash = get_md5_hash(new_key)
    while not starts_with_n_zeros(hash, num_leading_zeros):
        num += 1
        new_key = secret_key + str(num)
        hash = get_md5_hash(new_key)

        if num % 100000 == 0:
            print(num, end = '\t')
    
    print('')

    return num, hash

for n in range(3, 8):
    start=time.time()
    num, result = mine_coin3(secret_key, num_leading_zeros=n)
    print(num, result)
    end = time.time()
    print(f"Time for {n} zeros = {end-start:0.3f}")