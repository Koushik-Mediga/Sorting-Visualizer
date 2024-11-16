let container = document.querySelector(".sortingBox");
let arr=[]
let speed = 5;
let algoChoice = 0;
function initializeBoxes(n){
    container.innerHTML = "";
    for(i=0; i<n; i++){
        let box = document.createElement("div");
        box.classList.add("box");
        arr[i] = Math.random()
        box.style.height = (arr[i]*100 + 5)+"%";
        box.style.width = 100/n+"%";
        container.appendChild(box);
    }
}

initializeBoxes((document.querySelector(".length")).value)

let button = document.querySelector(".bubbleSort");
let initializeButton = document.querySelector(".initialize");
let runAllButton = document.querySelector(".runAll");
let boxes = document.querySelectorAll(".box");

initializeButton.addEventListener("click",()=>{
    let n = (document.querySelector(".length")).value;
    speed = (document.querySelector(".speed")).value;
    initializeBoxes(n);
})

function displaySortedArray(arr){
    n = arr.length
    box = document.querySelectorAll(".box");
    for(let p=0;p<n;p++){
        box[p].style.height = arr[p]*100+"%";
    }
}
function showSwap(arr, index1, index2, color){
    box = document.querySelectorAll(".box");
    for(let i=0; i<arr.length; i++){
        if(i==index1 || i==index2){
            box[i].style.backgroundColor = color;
        }
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

runAllButton.addEventListener("click",async ()=>{
    const selectedRadio = document.querySelector('input[name="sortingAlgo"]:checked');
    switch(selectedRadio.value){
        case "bubbleSort":
            animateSwaps(arr, bubbleSort);
            break;
        case "mergeSort":
            animateSwaps(arr, mergeSort);
            break;
        case "selectionSort":
            animateSwaps(arr, selectionSort);
            break;
        case "insertionSort":
            animateSwaps(arr, insertionSort);
            break;
        case "quickSort":
            animateSwaps(arr, quickSort);
            break;
    }
})

async function animateSwaps(arr, sortingFun){
    let moves = sortingFun(arr);
    console.log(moves.length);
    console.log(moves);
    let speedVar = (20+((10-speed)*100));
    for(i=0; i<moves.length;i++){
        showSwap(arr, moves[i][0][0], moves[i][0][1], "#d1d0c5");
        await delay(speedVar);
        if(moves[i][1]=="swap"){
            [ arr[moves[i][0][0]], arr[moves[i][0][1]] ] = [ arr[moves[i][0][1]], arr[moves[i][0][0]] ];
        }
        displaySortedArray(arr);
        if(moves[i][1]=="swap"){
            await delay(speedVar);
        }
        showSwap(arr, moves[i][0][0], moves[i][0][1], "#e2b714");
    }
}

function bubbleSort(arr) {
    let moves = []
    let n = arr.length;
    copy = []
    for(k=0; k<n; k++){
        copy.push(arr[k]);
    }
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (copy[j] > copy[j + 1]) {
          let temp = copy[j];
          copy[j] = copy[j + 1];
          copy[j + 1] = temp;
          moves.push([[j,j+1], "swap"]);
        }
        else{
            moves.push([[j, j+1], "noswap"]);
        }
      }
    }
    return moves;
}

function insertionSort(arr) {
    let moves = [];  // Array to store the moves (swap and no-swap)
    let n = arr.length;
    let copy = [];

    // Copy the input array to preserve the original
    for (let k = 0; k < n; k++) {
        copy.push(arr[k]);
    }

    // Insertion sort logic
    for (let i = 1; i < n; i++) {
        let key = copy[i];
        let j = i - 1;

        // Compare the key with elements in the sorted part of the array
        while (j >= 0 && copy[j] > key) {
            copy[j + 1] = copy[j];  // Shift elements to the right
            moves.push([[j, j + 1], "swap"]);  // Record a swap move
            j = j - 1;
        }

        // Place the key in its correct position
        copy[j + 1] = key;

        // Record that no swap was done for the comparison made
        if (j >= 0) {
            moves.push([[j, j + 1], "noswap"]);
        }
    }

    return moves;
}

function selectionSort(arr) {
    let moves = [];
    let n = arr.length;
    let copy = [];

    for (let k = 0; k < n; k++) {
        copy.push(arr[k]);
    }

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;

        for (let j = i + 1; j < n; j++) {
            if (copy[j] < copy[minIndex]) {
                minIndex = j;
            }
            moves.push([[j,minIndex],"noswap"]);
        }

        if (minIndex !== i) {
            let temp = copy[i];
            copy[i] = copy[minIndex];
            copy[minIndex] = temp;
            moves.push([[i, minIndex],"swap"]); 
        }
    }
    return moves;
}

function mergeSort(arr) {
    let swaps = []; // To store the indexes being swapped for visualization

    // Helper function to merge two sorted arrays
    function merge(left, right, leftIndices, rightIndices) {
        console.log("Merging:", { left, right, leftIndices, rightIndices }); // Debugging merge input

        let result = [];
        let mergedIndices = [];
        let i = 0;
        let j = 0;

        // Compare and merge elements from left and right arrays
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                result.push(left[i]);
                mergedIndices.push(leftIndices[i]);
                i++;
            } else {
                result.push(right[j]);
                mergedIndices.push(rightIndices[j]);

                // Record swaps (the indices being compared)
                swaps.push([leftIndices[i], rightIndices[j]]);
                j++;
            }
        }

        // Append remaining elements and their indices
        while (i < left.length) {
            result.push(left[i]);
            mergedIndices.push(leftIndices[i]);
            i++;
        }
        while (j < right.length) {
            result.push(right[j]);
            mergedIndices.push(rightIndices[j]);
            j++;
        }

        console.log("Merged Result:", { result, mergedIndices }); // Debugging merged output
        return { mergedArray: result, mergedIndices };
    }

    // Recursive merge sort function
    function sort(arr, indices) {
        console.log("Sorting:", { arr, indices }); // Debugging recursive input

        if (arr.length <= 1) {
            return { sortedArray: arr, sortedIndices: indices };
        }

        const mid = Math.floor(arr.length / 2);
        const left = arr.slice(0, mid);
        const right = arr.slice(mid);
        const leftIndices = indices.slice(0, mid);
        const rightIndices = indices.slice(mid);

        // Recursively split and sort
        const sortedLeft = sort(left, leftIndices);
        const sortedRight = sort(right, rightIndices);

        // Merge sorted halves
        return merge(
            sortedLeft.sortedArray,
            sortedRight.sortedArray,
            sortedLeft.sortedIndices,
            sortedRight.sortedIndices
        );
    }

    // Initialize indices to track original positions
    const indices = arr.map((_, index) => index);

    // Start the sort process
    const { sortedArray } = sort(arr, indices);

    console.log("Final sorted array:", sortedArray); // Debugging final sorted array
    return swaps; // Return the swaps (indexes) for visualization
}



function quickSort(arr) {
    let moves = [];

    function partition(arr, low, high) {
        let pivot = arr[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                let temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                if(i!=j){
                    moves.push([[i, j],"swap"]);
                }
            }else{
                moves.push([[i,j], "noswap"]);
            }
        }

        let temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        if(i+1!=high){
            moves.push([[i + 1, high],"swap"]);
        }
        return i + 1;
    }

    function sort(arr, low, high) {
        if (low < high) {
            let pi = partition(arr, low, high);

            sort(arr, low, pi - 1);
            sort(arr, pi + 1, high);
        }
    }

    let copy = [...arr];
    sort(copy, 0, copy.length - 1);

    return moves;
}
