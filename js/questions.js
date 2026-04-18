const QUESTIONS = {
  javascript: [
    { q: "What does `typeof null` return in JavaScript?", options: ["null", "object", "undefined", "string"], ans: 1 },
    { q: "Which method parses a JSON string into an object?", options: ["JSON.stringify()", "JSON.parse()", "JSON.decode()", "JSON.convert()"], ans: 1 },
    { q: "What is a closure?", options: ["A loop construct", "A function accessing its outer scope", "An error handler", "A built-in class"], ans: 1 },
    { q: "Which keyword creates a block-scoped variable?", options: ["var", "let", "both var & let", "function"], ans: 1 },
    { q: "What does `===` check?", options: ["Value only", "Type only", "Value AND type", "Reference equality"], ans: 2 },
    { q: "What is `0.1 + 0.2 === 0.3` in JS?", options: ["true", "false", "NaN", "undefined"], ans: 1 },
    { q: "Which array method returns a NEW array without mutating?", options: ["push()", "splice()", "map()", "sort()"], ans: 2 },
    { q: "What does the `async` keyword do to a function?", options: ["Makes it run faster", "Makes it return a Promise", "Blocks execution", "Adds error handling"], ans: 1 },
    { q: "What is the output of `typeof []`?", options: ["array", "object", "list", "undefined"], ans: 1 },
    { q: "Which event fires when the DOM is fully loaded?", options: ["onload", "DOMContentLoaded", "ready", "init"], ans: 1 }
  ],
  python: [
    { q: "What is the output of `type([])`?", options: ["array", "list", "<class 'list'>", "tuple"], ans: 2 },
    { q: "Which keyword defines a function in Python?", options: ["function", "func", "def", "define"], ans: 2 },
    { q: "What does `len('hello')` return?", options: ["4", "5", "6", "error"], ans: 1 },
    { q: "How do you start a single-line comment in Python?", options: ["//", "/*", "--", "#"], ans: 3 },
    { q: "Which data type is IMMUTABLE in Python?", options: ["list", "dict", "set", "tuple"], ans: 3 },
    { q: "What does `range(5)` produce?", options: ["[1,2,3,4,5]", "[0,1,2,3,4]", "[0,1,2,3,4,5]", "[1,2,3,4]"], ans: 1 },
    { q: "How do you inherit class A into class B?", options: ["class B extends A", "class B:A", "class B(A)", "class B inherits A"], ans: 2 },
    { q: "What is `__init__` in Python?", options: ["Destructor", "Module loader", "Constructor method", "Decorator"], ans: 2 },
    { q: "Which built-in function returns the largest item?", options: ["largest()", "max()", "top()", "high()"], ans: 1 },
    { q: "What does `//` operator do in Python?", options: ["Comment", "Division", "Floor division", "Modulo"], ans: 2 }
  ],
  science: [
    { q: "What is the approximate speed of light?", options: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"], ans: 1 },
    { q: "What is the chemical formula of water?", options: ["H2O2", "HO2", "H2O", "H3O"], ans: 2 },
    { q: "Which planet is closest to the Sun?", options: ["Venus", "Mars", "Earth", "Mercury"], ans: 3 },
    { q: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Golgi body", "Mitochondria"], ans: 3 },
    { q: "What is Newton's Second Law?", options: ["F = mv", "F = ma", "F = m/a", "F = v/t"], ans: 1 },
    { q: "What is the atomic number of Carbon?", options: ["4", "6", "8", "12"], ans: 1 },
    { q: "What gas do plants absorb during photosynthesis?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], ans: 2 },
    { q: "What is the unit of electric current?", options: ["Volt", "Watt", "Ohm", "Ampere"], ans: 3 },
    { q: "What is DNA short for?", options: ["Dynamic Nucleic Acid", "Deoxyribonucleic Acid", "Dual Nitrogen Acid", "Dense Nucleic Array"], ans: 1 },
    { q: "What force keeps planets in orbit around the Sun?", options: ["Magnetic force", "Nuclear force", "Gravity", "Friction"], ans: 2 }
  ],
  history: [
    { q: "In which year did World War II end?", options: ["1943", "1944", "1945", "1946"], ans: 2 },
    { q: "Who was the first President of the United States?", options: ["Abraham Lincoln", "Thomas Jefferson", "George Washington", "John Adams"], ans: 2 },
    { q: "Where did the Renaissance movement begin?", options: ["France", "England", "Spain", "Italy"], ans: 3 },
    { q: "Who wrote the US Declaration of Independence?", options: ["Alexander Hamilton", "Thomas Jefferson", "James Madison", "Benjamin Franklin"], ans: 1 },
    { q: "In which year did the Berlin Wall fall?", options: ["1987", "1988", "1989", "1991"], ans: 2 },
    { q: "Which empire was ruled by Julius Caesar?", options: ["Greek Empire", "Ottoman Empire", "Roman Empire", "Persian Empire"], ans: 2 },
    { q: "What was the first country to grant women the right to vote?", options: ["USA", "UK", "Australia", "New Zealand"], ans: 3 },
    { q: "Who invented the telephone?", options: ["Thomas Edison", "Nikola Tesla", "Alexander Graham Bell", "Guglielmo Marconi"], ans: 2 },
    { q: "In which year did India gain independence?", options: ["1945", "1946", "1947", "1948"], ans: 2 },
    { q: "Which ancient wonder stood in Alexandria, Egypt?", options: ["The Colosseum", "The Lighthouse", "The Hanging Gardens", "The Sphinx"], ans: 1 }
  ],
  math: [
    { q: "What is the value of π (pi) to 2 decimal places?", options: ["3.12", "3.14", "3.16", "3.41"], ans: 1 },
    { q: "What is the square root of 144?", options: ["11", "12", "13", "14"], ans: 1 },
    { q: "What is 15% of 200?", options: ["20", "25", "30", "35"], ans: 2 },
    { q: "What is the sum of interior angles of a triangle?", options: ["90°", "180°", "270°", "360°"], ans: 1 },
    { q: "What is 2 to the power of 8?", options: ["64", "128", "256", "512"], ans: 2 },
    { q: "What is the derivative of x²?", options: ["x", "2", "x²", "2x"], ans: 3 },
    { q: "What is log₁₀(1000)?", options: ["2", "3", "4", "10"], ans: 1 },
    { q: "What is the formula for the area of a circle?", options: ["2πr", "πr²", "πd", "2πr²"], ans: 1 },
    { q: "What is the Pythagorean theorem?", options: ["a+b=c", "a²+b²=c²", "a×b=c²", "a²-b²=c"], ans: 1 },
    { q: "What is the next number in: 1, 1, 2, 3, 5, 8, ?", options: ["11", "12", "13", "10"], ans: 2 }
  ]
};
