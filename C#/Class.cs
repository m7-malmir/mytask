namespace WebApplication22;

public class Person
{
    private int age;
    public string FirstName;

    private readonly int _age = 1;
    public int MyProperty { get; private set; }
    public int MyProperty1 { get; set; }
    public Person(int age)
    {
        _age = age;
    }
    public void ChangeAge()
    {
        _age++;
    }
}

