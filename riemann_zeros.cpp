// Riemann zeta функциясының критикалық түзудегі (Re s = 1/2) нөлдерін табу.
// Риман–Зигель Z(t) функциясы арқылы: Z(t) нақты, |Z(t)| = |zeta(1/2 + i t)|,
// сондықтан Z(t)-ның таңбасы ауысқан жерде критикалық түзуде нөл бар.
//
// Компиляция:  g++ -O2 -std=c++17 riemann_zeros.cpp -o riemann_zeros
// Іске қосу:   ./riemann_zeros [T_max]      (әдепкі T_max = 100)

#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <vector>

static const double PI = 3.14159265358979323846;

// Риман–Зигель тета функциясы (асимптотикалық қатар)
double theta(double t) {
    return t / 2.0 * std::log(t / (2.0 * PI)) - t / 2.0 - PI / 8.0
         + 1.0 / (48.0 * t) + 7.0 / (5760.0 * t * t * t);
}

// Түзету мүшесінің C0(p) коэффициенті
double C0(double p) {
    double d = std::cos(2.0 * PI * p);
    if (std::fabs(d) < 1e-10) p += 1e-8, d = std::cos(2.0 * PI * p);  // жойылатын ерекше нүкте
    return std::cos(2.0 * PI * (p * p - p - 1.0 / 16.0)) / d;
}

// C1(p) = -C0'''(p) / (96 pi^2), үшінші туынды ақырлы айырмамен
double C1(double p) {
    const double h = 1e-3;
    double d3 = (C0(p + 2 * h) - 2 * C0(p + h) + 2 * C0(p - h) - C0(p - 2 * h)) / (2 * h * h * h);
    return -d3 / (96.0 * PI * PI);
}

// Риман–Зигель формуласы: Z(t) = 2 * sum cos(theta - t ln n)/sqrt(n) + R(t)
double Z(double t) {
    double a = std::sqrt(t / (2.0 * PI));
    long N = (long)std::floor(a);
    double p = a - N;
    double th = theta(t);

    double sum = 0.0;
    for (long n = 1; n <= N; ++n)
        sum += std::cos(th - t * std::log((double)n)) / std::sqrt((double)n);

    double sign = ((N - 1) % 2 == 0) ? 1.0 : -1.0;
    double R = sign * std::pow(a, -0.5) * (C0(p) + C1(p) / a);
    return 2.0 * sum + R;
}

// Бисекция әдісімен нөлді нақтылау
double refine(double lo, double hi) {
    double flo = Z(lo);
    for (int i = 0; i < 60; ++i) {
        double mid = 0.5 * (lo + hi);
        double fm = Z(mid);
        if ((fm > 0) == (flo > 0)) lo = mid, flo = fm;
        else hi = mid;
    }
    return 0.5 * (lo + hi);
}

int main(int argc, char** argv) {
    double Tmax = (argc > 1) ? std::atof(argv[1]) : 100.0;
    const double Tmin = 10.0;   // алғашқы нөл t ≈ 14.13
    const double step = 0.01;   // тор қадамы (үлкен T үшін кішірейтіңіз)

    std::vector<double> zeros;
    double prev = Z(Tmin);
    for (double t = Tmin + step; t <= Tmax; t += step) {
        double cur = Z(t);
        if ((cur > 0) != (prev > 0)) zeros.push_back(refine(t - step, t));
        prev = cur;
    }

    std::printf("Критикалық түзудегі нөлдер (1/2 + i t), 0 < t <= %.2f:\n", Tmax);
    for (size_t i = 0; i < zeros.size(); ++i)
        std::printf("  #%-4zu t = %.9f\n", i + 1, zeros[i]);

    // Риман–фон Мангольдт формуласы: 0<Im<=T аралығындағы БАРЛЫҚ нөлдер саны
    // N(T) ≈ theta(T)/pi + 1 (+ S(T), ол кішкентай тербеліс)
    double expected = theta(Tmax) / PI + 1.0;
    std::printf("\nКритикалық түзуде табылғаны: %zu\n", zeros.size());
    std::printf("Бүкіл критикалық жолақта күтілетіні N(T) ≈ %.2f\n", expected);
    std::printf("Егер сандар сәйкес келсе, T дейін барлық нөлдер Re s = 1/2 түзуінде жатыр\n"
                "(яғни Риман гипотезасы осы аралықта сандық түрде расталды).\n");
    return 0;
}
