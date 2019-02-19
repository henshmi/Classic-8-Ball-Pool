
export const mapRange = (num: number, in_min: number, in_max: number, out_min: number, out_max: number) => {
    let value: number = (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    value  = value < out_min ? out_min : value;
    value = value > out_max ? out_max : value;
    return value;
}