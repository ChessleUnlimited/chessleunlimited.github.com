let complexPI = 3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989


//P5JS ONLY
// fill() or noFill(), stroke() or NoStroke(), strokeWeight
function customize(c, s, sw) { // fill(255, 255, 255) if 256 then noFill(), stroke(255, 255, 255) if 256 then noStroke(), strokeWeight
    if (c != 256) {
        fill(c);
    } else {
        noFill();
    }
    if (s != 256) {
        stroke(s);
    } else {
        noStroke();
    }
    strokeWeight(sw);
}


// Draw a hexagon
function hexagon(x, y, length) {
    push();
    beginShape();
    translate(x, y);
    vertex(-length, -length * 1.733333333333333);
    vertex(length, -length * 1.733333333333333);
    vertex(length * 2, 0);
    vertex(length, length * 1.733333333333333);
    vertex(-length, length * 1.733333333333333);
    vertex(-length * 2, 0);
    endShape();
    pop();
}


class Average {
    static find(values) {
        if (values instanceof Array) {
            let total = 0;
            for (let i = 0; i < values.length; i++) {
                total += values[i];
            }
            total /= values.length;
            return total;
        }
    }
}


// Find the area of a shape
class FindArea {
    static triangle(base, height) {
        return (1 / 2) * base * height;
    }

    static square(length) {
        return length * length;
    }

    static rectangle(base, height) {
        return base * height;
    }

    static trapezoid(a, b, h) {
        return ((a + b) / 2) * h;
    }

    static circle(radius) {
        return complexPI * (radius * radius);
    }
}

// Find the perimeter of a shape
class FindPerimeter {
    static circle(radius) {
        return (2 * complexPI * radius);
    }

    static square(length) {
        return (length * 4);
    }

    static rectangle(base, height) {
        return ((base * 2) + (height * 2));
    }

    static triangle(a, b, c) {
        return (a + b + c);
    }
}


class BasicMath {

    static multiply(a, b) {
        return a * b;
    }

    static divide(a, b) {
        return a / b;
    }

    static add(a, b) {
        return a + b;
    }

    static subtract(a, b) {
        return a - b;
    }

    static multiplyArray(arr) {
        let total = arr[0];
        for (let i = 1; i < arr.length; i++) {
            total *= arr[i];
        }
        return total;
    }

    static addArray(arr) {
        let total = 0;
        for (let i = 0; i < arr.length; i++) {
            total += arr[i];
        }
        return total;
    }

    static subtractArrayFromNumber(number, arr) {
        for (let i = 0; i < arr.length; i++) {
            number -= arr[i];
        }
        return number;
    }

}



// f(x)
class Equation {
    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    static setA(equation, a) {
        equation.a = a;
    }

    static setB(equation, b) {
        equation.b = b;
    }

    static setC(equation, c) {
        equation.c = c;
    }

    static setValues(equation, a, b, c) {
        equation.a = a;
        equation.b = b;
        equation.c = c;
    }

    setA(a) {
        this.a = a;
    }

    setB(b) {
        this.b = b;
    }

    setC(c) {
        this.c = c;
    }

    setValues(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    f(x) {
        let e = new Equation(this.a, this.b, this.c);
        return (e.a * (x * x)) + (e.b * x) + e.c;
    }

    static f(equation, x) {
        let e = new Equation(equation.a, equation.b, equation.c);
        return (e.a * (x * x)) + (e.b * x) + e.c;
    }
}

// Quadratic Formula
class QF {
    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    static setA(formula, a) {
        formula.a = a;
    }

    static setB(formula, b) {
        formula.b = b;
    }

    static setC(formula, c) {
        formula.c = c;
    }

    static setValues(formula, a, b, c) {
        formula.a = a;
        formula.b = b;
        formula.c = c;
    }

    setA(a) {
        this.a = a;
    }

    setB(b) {
        this.b = b;
    }

    setC(c) {
        this.c = c;
    }

    setValues(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    static solve(formula) {
        let arr = [];
        // +
        let d = (formula.b * formula.b) - (4 * formula.a * formula.c);
        arr.push(((-1 * formula.b) + Math.sqrt(d)) / (2 * (formula.a)));
        // - 
        let dM = (formula.b * formula.b) - (4 * formula.a * formula.c);
        arr.push(((-1 * formula.b) - Math.sqrt(dM)) / (2 * (formula.a)));
        if (d < 0 || dM < 0) {
            return "discriminant less that 0";
        }
        return arr;
    }

    solve() {
        let arr = [];
        // +
        let d = (this.b * this.b) - (4 * this.a * this.c);
        arr.push(((-1 * this.b) + Math.sqrt(d)) / (2 * (this.a)));
        // - 
        let dM = (this.b * this.b) - (4 * this.a * this.c);
        arr.push(((-1 * this.b) - Math.sqrt(dM)) / (2 * (this.a)));
        if (d < 0 || dM < 0) {
            return "discriminant less that 0";
        }
        return arr;
    }
}

// Axis of Symmetry
class AoS {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }

    static setA(formula, a) {
        formula.a = a;
    }

    static setB(formula, b) {
        formula.b = b;
    }

    static setValues(formula, a, b) {
        formula.a = a;
        formula.b = b;
    }

    setA(a) {
        this.a = a;
    }

    setB(b) {
        this.b = b;
    }

    setValues(a, b) {
        this.a = a;
        this.b = b;
    }

    static solve(formula) {
        return (-1 * (formula.b)) / (2 * formula.a);
    }
    solve() {
        return (-1 * (this.b)) / (2 * this.a);
    }
}

function randomInt(a, b) {
    let rand = random(a, b+1);
    rand = int(rand);
    return rand;
}

