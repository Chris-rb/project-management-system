using BCrypt.Net;

namespace ProjectTracker.API.Helpers;

public static class PasswordHelper
{
    private const int WorkFactor = 12;

    public static string HashPassword(string password)
    {
        if (string.IsNullOrWhiteSpace(password))
        {
            throw new ArgumentException("Password canot be empty", nameof(password));
        }

        return BCrypt.Net.BCrypt.HashPassword(password, WorkFactor);
    }

    public static bool VerifyPassword(string password, string hash)
    {
        if (string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(hash))
            return false;

        try
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
        catch (SaltParseException)
        {
            return false;
        }
    }
}
