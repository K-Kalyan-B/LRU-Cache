class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.map = new Map();
        // Initialize circular doubly linked list with dummy head
        this.head = new Node(0, 0);
        this.head.next = this.head;
        this.head.prev = this.head;
    }

    // Add node right after head
    add(node) {
        node.prev = this.head;
        node.next = this.head.next;
        this.head.next.prev = node;
        this.head.next = node;
    }

    // Remove node from list
    remove(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    get(key) {
        if (this.map.has(key)) {
            const node = this.map.get(key);
            this.remove(node);
            this.add(node);
            updateDisplay();
            return node.value;
        }
        return -1;
    }

    put(key, value) {
        if (this.map.has(key)) {
            const node = this.map.get(key);
            this.remove(node);
            node.value = value;
            this.add(node);
        } else {
            const node = new Node(key, value);
            this.map.set(key, node);
            this.add(node);
            
            if (this.map.size > this.capacity) {
                // Remove LRU (node before head)
                const lru = this.head.prev;
                this.remove(lru);
                this.map.delete(lru.key);
            }
        }
        updateDisplay();
    }
}

let cache = new LRUCache(3);

function updateDisplay() {
    const display = document.getElementById('cacheDisplay');
    display.innerHTML = '';
    let current = cache.head.next;
    
    while (current !== cache.head) {
        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'node';
        nodeDiv.textContent = `Key: ${current.key}, Val: ${current.value}`;
        display.appendChild(nodeDiv);
        
        if (current.next !== cache.head) {
            const arrow = document.createElement('span');
            arrow.className = 'arrow';
            arrow.textContent = '↔';
            display.appendChild(arrow);
        }
        current = current.next;
    }
}

function getValue() {
    const key = parseInt(document.getElementById('keyInput').value);
    const result = cache.get(key);
    const output = document.getElementById('output');
    output.textContent = result === -1 ? 
        `Key ${key} not found` : 
        `Found value ${result} for key ${key}`;
    document.getElementById('keyInput').value = '';
}

function putValue() {
    const key = parseInt(document.getElementById('keyInput').value);
    const capacityInput = document.getElementById('capacity');
    cache.capacity = parseInt(capacityInput.value);
    cache.put(key, Math.floor(Math.random() * 100)); // Random value for demo
    document.getElementById('output').textContent = 
        `Added/Updated key ${key}`;
    document.getElementById('keyInput').value = '';
}

// Initial display
updateDisplay();