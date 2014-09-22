# Compile stylesheet (compass watch)
if File.exists?("./config.rb")
  # Compile on start.
  puts `compass compile --time --quiet`
  # https://github.com/guard/guard-compass
  guard :compass do
    watch(%r{(.*)\.s[ac]ss$})
  end
end