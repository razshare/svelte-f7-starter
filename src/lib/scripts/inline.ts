export default function inline(c:Function):string{
    c();
    return '';
}