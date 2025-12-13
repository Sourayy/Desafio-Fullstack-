public static class Validator
{
    public static bool IsValidCPF(string cpf)
    {
        cpf = cpf.Replace(".", "").Replace("-", "").Trim();

        if (cpf.Length != 11 || cpf.Distinct().Count() == 1) return false;

        int[] mult1 = { 10, 9, 8, 7, 6, 5, 4, 3, 2 };
        int[] mult2 = { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };

        string tempCpf = cpf.Substring(0, 9);
        int sum = 0;

        for (int i = 0; i < 9; i++)
            sum += int.Parse(tempCpf[i].ToString()) * mult1[i];

        int remainder = sum % 11;
        int dig10 = remainder < 2 ? 0 : 11 - remainder;

        tempCpf += dig10;
        sum = 0;
        for (int i = 0; i < 10; i++)
            sum += int.Parse(tempCpf[i].ToString()) * mult2[i];

        remainder = sum % 11;
        int dig11 = remainder < 2 ? 0 : 11 - remainder;

        return cpf.EndsWith(dig10.ToString() + dig11.ToString());
    }

    public static bool IsValidCNPJ(string cnpj)
    {
        cnpj = cnpj.Replace(".", "").Replace("-", "").Replace("/", "").Trim();

        if (cnpj.Length != 14 || cnpj.Distinct().Count() == 1) return false;

        int[] mult1 = { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
        int[] mult2 = { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };

        string tempCnpj = cnpj.Substring(0, 12);
        int sum = 0;

        for (int i = 0; i < 12; i++)
            sum += int.Parse(tempCnpj[i].ToString()) * mult1[i];

        int remainder = sum % 11;
        int dig13 = remainder < 2 ? 0 : 11 - remainder;

        tempCnpj += dig13;
        sum = 0;
        for (int i = 0; i < 13; i++)
            sum += int.Parse(tempCnpj[i].ToString()) * mult2[i];

        remainder = sum % 11;
        int dig14 = remainder < 2 ? 0 : 11 - remainder;

        return cnpj.EndsWith(dig13.ToString() + dig14.ToString());
    }

    public static bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }

    public static bool IsValidBirthDate(DateTime? birthDate)
    {
        if (!birthDate.HasValue) return false;

        DateTime today = DateTime.Today;
        DateTime oldest = today.AddYears(-100);

        return birthDate.Value <= today && birthDate.Value >= oldest;
    }
}
